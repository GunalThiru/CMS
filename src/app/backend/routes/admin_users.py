# routes/admin_users.py

from flask import Blueprint, request, jsonify
from extensions import db
from models import User, Complaint, ComplaintAssignment
from sqlalchemy import func, cast, String, case

admin_users_bp = Blueprint("admin_users", __name__, url_prefix="/admin/users")


# ----------------------------------------
# Pagination Utility
# ----------------------------------------
def paginate(query, page, page_size):
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    total_pages = (total + page_size - 1) // page_size
    return items, total, total_pages


# =====================================================
#                STAFF LIST (assigned + resolved + closed)
# =====================================================
@admin_users_bp.route("/staff", methods=["GET"])
def get_staff_list():
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 10))
    q = request.args.get("q", "").strip()

    # Base staff query
    staff_query = db.session.query(User).filter(User.role == "staff")

    # Search support
    if q:
        like = f"%{q}%"
        staff_query = staff_query.filter(
            (User.name.ilike(like)) |
            (cast(User.uid, String).ilike(like))
        )

    total = staff_query.count()
    staff_list = staff_query.offset((page - 1) * page_size).limit(page_size).all()
    total_pages = (total + page_size - 1) // page_size

    results = []

    for staff in staff_list:

        # Total assigned complaints
        assigned_total = (
            db.session.query(ComplaintAssignment)
            .filter(ComplaintAssignment.assigned_to == staff.uid)
            .count()
        )

        # Resolved assigned complaints
    
        # Closed assigned complaints
        closed_total = (
            db.session.query(ComplaintAssignment)
            .join(Complaint, Complaint.id == ComplaintAssignment.complaint_id)
            .filter(
                ComplaintAssignment.assigned_to == staff.uid,
                Complaint.status == "closed"
            )
            .count()
        )

        results.append({
            "id": staff.uid,
            "name": staff.name,
            "assigned": assigned_total,
            "resolved": closed_total,
            "closed": closed_total,
        })

    return jsonify({
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
        "items": results
    })

# =====================================================
#                CUSTOMER LIST (filed + resolved + closed)
# =====================================================
@admin_users_bp.route("/customers", methods=["GET"])
def get_customer_list():
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 10))
    q = request.args.get("q", "").strip()

    customer_query = db.session.query(User).filter(User.role == "customer")

    # Search support
    if q:
        like = f"%{q}%"
        customer_query = customer_query.filter(
            (User.name.ilike(like)) |
            (cast(User.uid, String).ilike(like))
        )

    total = customer_query.count()
    customers = customer_query.offset((page - 1) * page_size).limit(page_size).all()
    total_pages = (total + page_size - 1) // page_size

    results = []

    for cust in customers:

        # All complaints
        total_complaints = (
            db.session.query(Complaint)
            .filter(Complaint.user_id == cust.uid)
            .count()
        )

    
        # Closed complaints
        closed_count = (
            db.session.query(Complaint)
            .filter(
                Complaint.user_id == cust.uid,
                Complaint.status == "closed"
            )
            .count()
        )

        results.append({
            "id": cust.uid,
            "name": cust.name,
            "total": total_complaints,
            "resolved": closed_count,
           # "closed": closed_count
        })

    return jsonify({
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
        "items": results
    })
# =====================================================