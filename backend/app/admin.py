from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from fastapi import HTTPException
from .database import get_db

def get_admin_statistics() -> Dict[str, Any]:
    """
    Calculates competition statistics for the administrator dashboard.
    These statistics must NEVER be exposed to contestants.
    """
    with get_db() as conn:
        cursor = conn.cursor()

        # 1. Total registered teams
        cursor.execute("SELECT COUNT(*) FROM teams;")
        total_registered = cursor.fetchone()[0]

        # 2. Active teams (teams with at least one active session)
        cursor.execute("""
            SELECT COUNT(DISTINCT team_id) FROM sessions WHERE active = 1;
        """)
        active_teams = cursor.fetchone()[0]

        # 3. Submitted teams
        cursor.execute("SELECT COUNT(*) FROM teams WHERE quiz_submitted_at IS NOT NULL;")
        submitted_teams = cursor.fetchone()[0]

        # 4. Unsubmitted teams
        unsubmitted_teams = total_registered - submitted_teams

        # 5. Highest score and average score (including real-time scores for active attempts)
        cursor.execute("""
            SELECT
                MAX(COALESCE(t.score, (
                    SELECT COALESCE(SUM(q.marks), 0)
                    FROM answers a
                    JOIN quiz_questions q ON a.question_number = q.question_number
                    WHERE a.team_id = t.id AND a.selected_answer = q.correct_answer
                ))),
                AVG(COALESCE(t.score, (
                    SELECT COALESCE(SUM(q.marks), 0)
                    FROM answers a
                    JOIN quiz_questions q ON a.question_number = q.question_number
                    WHERE a.team_id = t.id AND a.selected_answer = q.correct_answer
                )))
            FROM teams t
            WHERE t.quiz_started_at IS NOT NULL OR t.quiz_submitted_at IS NOT NULL;
        """)
        row = cursor.fetchone()
        highest_score = row[0] if (row and row[0] is not None) else 0
        avg_score = round(float(row[1]), 1) if (row and row[1] is not None) else 0.0

        return {
            "total_registered_teams": total_registered,
            "active_teams": active_teams,
            "submitted_teams": submitted_teams,
            "unsubmitted_teams": unsubmitted_teams,
            "highest_score": highest_score,
            "average_score": avg_score,
            "completed_attempts": submitted_teams
        }

def get_admin_ranking(limit: int = 10) -> List[Dict[str, Any]]:
    """
    Returns teams ranked by score with live in-progress calculation.
    Tiebreaker: Submitted teams rank higher, then duration, then ID.
    """
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT t.id, t.team_name, t.member1_name, t.member2_name,
                   COALESCE(t.score, (
                       SELECT COALESCE(SUM(q.marks), 0)
                       FROM answers a
                       JOIN quiz_questions q ON a.question_number = q.question_number
                       WHERE a.team_id = t.id AND a.selected_answer = q.correct_answer
                   )) AS score,
                   COALESCE(t.correct_count, (
                       SELECT COUNT(*)
                       FROM answers a
                       JOIN quiz_questions q ON a.question_number = q.question_number
                       WHERE a.team_id = t.id AND a.selected_answer = q.correct_answer
                   )) AS correct_count,
                   COALESCE(t.wrong_count, (
                       SELECT COUNT(*)
                       FROM answers a
                       JOIN quiz_questions q ON a.question_number = q.question_number
                       WHERE a.team_id = t.id AND a.selected_answer != q.correct_answer
                   )) AS wrong_count,
                   COALESCE(t.unanswered_count, (
                       50 - (SELECT COUNT(*) FROM answers a WHERE a.team_id = t.id)
                   )) AS unanswered_count,
                   t.quiz_started_at,
                   t.quiz_submitted_at,
                   COALESCE(t.duration_seconds, 0) AS duration_seconds,
                   t.submission_reason
            FROM teams t
            ORDER BY
                score DESC,
                (CASE WHEN t.quiz_submitted_at IS NOT NULL THEN 0 ELSE 1 END) ASC,
                duration_seconds ASC,
                t.id ASC
            LIMIT ?;
        """, (limit,))
        rows = cursor.fetchall()

        ranking_list = []
        for rank, row in enumerate(rows, start=1):
            item = dict(row)
            item["rank"] = rank
            ranking_list.append(item)

        return ranking_list

def get_admin_teams_overview() -> List[Dict[str, Any]]:
    """
    Returns complete team roster with live scores, answers count, and violation telemetry.
    """
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT t.id, t.team_name, t.member1_name, t.member2_name,
                   t.registered_at, t.login_used, t.active_session_id,
                   t.quiz_started_at, t.quiz_submitted_at, t.submission_reason,
                   t.allow_relogin,
                   COALESCE(t.violation_count, 0) AS violation_count,
                   COALESCE(t.score, (
                       SELECT COALESCE(SUM(q.marks), 0)
                       FROM answers a
                       JOIN quiz_questions q ON a.question_number = q.question_number
                       WHERE a.team_id = t.id AND a.selected_answer = q.correct_answer
                   )) AS score,
                   (SELECT COUNT(*) FROM answers a WHERE a.team_id = t.id) AS answered_count,
                   CASE WHEN s.id IS NOT NULL AND s.active = 1 THEN 1 ELSE 0 END AS has_active_session,
                   s.login_time AS session_login_time,
                   s.last_activity AS session_last_activity
            FROM teams t
            LEFT JOIN sessions s ON t.id = s.team_id AND s.active = 1
            GROUP BY t.id
            ORDER BY t.registered_at DESC;
        """)
        rows = cursor.fetchall()
        return [dict(r) for r in rows]

def get_admin_results_table() -> List[Dict[str, Any]]:
    """
    Returns full results table with calculated rank for all submitted teams.
    """
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, team_name, member1_name, member2_name, score,
                   correct_count, wrong_count, unanswered_count,
                   quiz_started_at, quiz_submitted_at, duration_seconds,
                   submission_reason
            FROM teams
            WHERE quiz_submitted_at IS NOT NULL
            ORDER BY score DESC, duration_seconds ASC, quiz_submitted_at ASC;
        """)
        rows = cursor.fetchall()

        results = []
        for rank, row in enumerate(rows, start=1):
            r = dict(row)
            r["rank"] = rank
            results.append(r)
        return results

def terminate_team_session(team_id: int) -> bool:
    """Force-terminates a team's active session from administrator control."""
    now_iso = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE teams SET active_session_id = NULL, active_tab_id = NULL WHERE id = ?", (team_id,))
        cursor.execute("UPDATE sessions SET active = 0, logout_time = ? WHERE team_id = ? AND active = 1", (now_iso, team_id))
        cursor.execute("INSERT INTO audit_logs (timestamp, event_type, team_id, details) VALUES (?, 'ADMIN_TERMINATE_SESSION', ?, 'Session terminated by admin')", (now_iso, team_id))
        return True

def authorize_team_relogin(team_id: int, reset_quiz: bool = False) -> bool:
    """
    Grants re-login authorization for a locked or completed team.
    If reset_quiz is True, resets quiz state to allow a fresh attempt.
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        cursor = conn.cursor()
        if reset_quiz:
            cursor.execute("""
                UPDATE teams SET
                    quiz_started_at = NULL,
                    quiz_submitted_at = NULL,
                    submission_reason = NULL,
                    score = NULL,
                    correct_count = NULL,
                    wrong_count = NULL,
                    unanswered_count = NULL,
                    duration_seconds = NULL,
                    allow_relogin = 1,
                    active_session_id = NULL,
                    active_tab_id = NULL,
                    violation_count = 0,
                    last_violation_at = NULL
                WHERE id = ?
            """, (team_id,))
            cursor.execute("DELETE FROM answers WHERE team_id = ?", (team_id,))
            cursor.execute("DELETE FROM team_question_order WHERE team_id = ?", (team_id,))
            cursor.execute("INSERT INTO audit_logs (timestamp, event_type, team_id, details) VALUES (?, 'ADMIN_RESET_QUIZ', ?, 'Quiz attempt reset by admin')", (now_iso, team_id))
        else:
            cursor.execute("""
                UPDATE teams SET allow_relogin = 1, active_session_id = NULL, active_tab_id = NULL, violation_count = 0, last_violation_at = NULL WHERE id = ?
            """, (team_id,))
            cursor.execute("INSERT INTO audit_logs (timestamp, event_type, team_id, details) VALUES (?, 'ADMIN_AUTHORIZE_RELOGIN', ?, 'Re-login authorized by admin')", (now_iso, team_id))
        return True

