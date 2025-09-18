from sqlalchemy import Column, Integer, String, DateTime, Float, create_engine, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    roll_number = Column(String, unique=True, nullable=False)
    attendance_count = Column(Integer, default=0)
    total_classes = Column(Integer, default=0)
    manual_attendance_count = Column(Integer, default=0)
    last_attendance_date = Column(DateTime)

class Attendance(Base):
    __tablename__ = 'attendance'
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, nullable=False)
    class_id = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String, nullable=False)

    def __repr__(self):
        return f"<Attendance(id={self.id}, student_id={self.student_id}, class_id={self.class_id}, timestamp={self.timestamp}, status='{self.status}')>"

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "class_id": self.class_id,
            "timestamp": self.timestamp.isoformat(),
            "status": self.status
        }

# Database setup
DATABASE_URL = "sqlite:///attendance.db"
engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(bind=engine)

# Helper functions
def mark_attendance(roll_number, status="present", manual=False):
    session = SessionLocal()
    student = session.query(Student).filter_by(roll_number=roll_number).first()
    if not student:
        session.close()
        return False
    student.attendance_count += 1
    student.total_classes += 1
    student.last_attendance_date = datetime.utcnow()
    if manual:
        student.manual_attendance_count += 1
    session.add(Attendance(
        student_id=student.id,
        class_id=student.total_classes,
        status=status
    ))
    session.commit()
    session.close()
    return True

def get_stats(roll_number, semester_total=100):
    session = SessionLocal()
    student = session.query(Student).filter_by(roll_number=roll_number).first()
    session.close()
    if not student:
        return None
    attended = student.attendance_count
    missed = student.total_classes - attended
    left = semester_total - student.total_classes
    percent = (attended / student.total_classes * 100) if student.total_classes > 0 else 0
    required = max(0, int((0.75 * semester_total) - attended))
    can_miss = max(0, int(attended + left - (0.75 * semester_total)))
    return {
        "attended": attended,
        "missed": missed,
        "left": left,
        "percent": percent,
        "required_for_75": required,
        "can_miss": can_miss
    }

def manual_attendance_by_code(roll_number, code):
    # Example: code must be "123456789"
    if code == "123456789":
        return mark_attendance(roll_number, status="present", manual=True)
    return False