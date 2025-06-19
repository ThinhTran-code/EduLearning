// src/components/CourseDetail.jsx

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FaChalkboardTeacher,
    FaBookOpen,
    FaClock,
    FaDollarSign,
    FaPlayCircle,
} from "react-icons/fa";
import backgroundImage from "../assest/6.jpg";

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(
                    `https://localhost:7211/api/courses/${id}`
                );
                if (!res.ok) throw new Error(`Lỗi ${res.status}`);
                const data = await res.json();
                setCourse(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <div className="text-white text-center mt-20">
                Đang tải khóa học…
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 text-center mt-20">
                Có lỗi xảy ra: {error}
            </div>
        );
    }

    return (
        <div
            className="text-white min-h-screen flex flex-col items-center py-12 px-6 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            {/* Tiêu đề & mô tả */}
            <h1 className="text-5xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg max-w-2xl text-center mb-8">
                {course.description}
            </p>

            <div className="bg-white bg-opacity-80 text-[#000080] p-8 rounded-lg shadow-lg max-w-4xl w-full">
                <div className="mb-6 flex items-center gap-6">
                    <FaChalkboardTeacher className="text-4xl" />
                    <div>
                        <p className="text-xl font-semibold">
                            Giảng viên: {course.tutorBio.fullName}
                        </p>
                        <p className="text-gray-700 mt-1">
                            {course.tutorBio.introduces}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-center gap-3">
                        <FaClock />{" "}
                        <span>
                            Buổi thử nghiệm:{" "}
                            {course.isTrialAvailable
                                ? `${course.trialSessions} buổi`
                                : "Không có"}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaDollarSign />{" "}
                        <span>Giá/buổi: ${course.pricePerSession}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaBookOpen />{" "}
                        <span>Số chương: {course.courseContents.length}</span>
                    </div>
                </div>

                {/* Nội dung khóa học */}
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold flex items-center gap-2">
                        <FaPlayCircle /> Nội dung khóa học
                    </h3>
                    <ul className="mt-3 list-disc list-inside space-y-1 text-lg">
                        {course.courseContents.slice(0, 10).map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="text-center">
                    <Link
                        to={`/enroll/${id}`}
                        className="bg-yellow-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition inline-block"
                    >
                        📢 Đăng ký ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
