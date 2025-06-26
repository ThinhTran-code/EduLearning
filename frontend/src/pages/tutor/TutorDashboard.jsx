import React, { useEffect, useState } from "react";
import { useUserId } from "../../hooks/useUserId";
import {
    FaChalkboardTeacher,
    FaUserGraduate,
    FaCalendarAlt,
    FaEnvelope,
    FaMoneyBillWave,
    FaStar,
} from "react-icons/fa";
import { fetchWithAuth } from "../../services/api";

const TutorDashboard = () => {
    const { id } = useUserId();
    const [dashboard, setDashboard] = useState(null);
    const [dashLoading, setDashLoading] = useState(true);
    const [dashError, setDashError] = useState("");
    const [recentMessages, setRecentMessages] = useState([]);

    useEffect(() => {
        if (!id) return;

        const fetchDashboard = async () => {
            try {
                const res = await fetchWithAuth(`/api/tutors/${id}/dashboard`);
                if (!res.ok) throw new Error(`Lỗi ${res.statusText}`);
                const { data } = await res.json();
                setDashboard(data);
            } catch (err) {
                setDashError(err.message);
            } finally {
                setDashLoading(false);
            }
        };

        const fetchRecentMessages = async () => {
            try {
                const res = await fetchWithAuth(
                    `/api/Chat/recent-messages/${id}`
                );
                if (res.ok) {
                    const msgs = await res.json();
                    setRecentMessages(msgs);
                }
            } catch (err) {
                console.error("Lỗi khi tải tin nhắn gần đây:", err);
            }
        };

        fetchDashboard();
        fetchRecentMessages();
    }, [id]);

    if (dashLoading) {
        return (
            <div className="text-white text-center mt-20">
                Đang thống kê dữ liệu....
            </div>
        );
    }

    if (dashError) {
        return (
            <div className="text-red-600 text-center mt-20">
                Có lỗi xảy ra: {dashError}
            </div>
        );
    }

    return (
        <div className="flex-grow p-10 bg-gray-100">
            <h1 className="text-4xl font-bold text-[#000080] text-center mb-6">
                Dashboard Gia sư
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                    <FaChalkboardTeacher className="text-[#000080] text-3xl" />
                    <div>
                        <h2 className="text-xl font-semibold">
                            Tổng số slot lớp học
                        </h2>
                        <p className="text-3xl font-bold text-[#000080]">
                            {dashboard.slots}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                    <FaUserGraduate className="text-[#000080] text-3xl" />
                    <div>
                        <h2 className="text-xl font-semibold">Số học viên</h2>
                        <p className="text-3xl font-bold text-[#000080]">
                            {dashboard.totalStudents}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                    <FaEnvelope className="text-red-500 text-3xl" />
                    <div>
                        <h2 className="text-xl font-semibold">
                            Tin nhắn chưa đọc
                        </h2>
                        <p className="text-3xl font-bold text-red-500">
                            {dashboard.totalNewMessage}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                    <FaMoneyBillWave className="text-green-500 text-3xl" />
                    <div>
                        <h2 className="text-xl font-semibold">
                            Doanh thu tháng này
                        </h2>
                        <p className="text-3xl font-bold text-green-500">
                            {dashboard.incomePerMonth} VNĐ
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                    <FaStar className="text-yellow-500 text-3xl" />
                    <div>
                        <h2 className="text-xl font-semibold">
                            Đánh giá trung bình
                        </h2>
                        <p className="text-3xl font-bold text-yellow-500">
                            {dashboard.overalls} ★
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                    <FaCalendarAlt /> Lịch dạy sắp tới
                </h2>
                <ul className="mt-3 list-disc list-inside text-lg">
                    {dashboard.upcomingSchedules.map((item, index) => (
                        <li key={index}>📅 {item}</li>
                    ))}
                </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                    <FaEnvelope /> Tin nhắn gần đây
                </h2>
                <ul className="mt-3 list-disc list-inside text-lg">
                    {recentMessages.length > 0 ? (
                        recentMessages.map((msg, index) => (
                            <li key={index}>
                                📩 {msg.senderName}: "{msg.content}"
                            </li>
                        ))
                    ) : (
                        <li>Không có tin nhắn nào gần đây.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default TutorDashboard;
