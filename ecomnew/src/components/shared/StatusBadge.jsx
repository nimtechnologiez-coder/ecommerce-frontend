"use client";

const statusMap = {
    PENDING: { label: "PENDING", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.08)", border: "rgba(245, 158, 11, 0.2)" },
    APPROVED: { label: "APPROVED", color: "#10B981", bg: "rgba(16, 185, 129, 0.08)", border: "rgba(16, 185, 129, 0.2)" },
    REJECTED: { label: "REJECTED", color: "#EF4444", bg: "rgba(239, 68, 68, 0.08)", border: "rgba(239, 68, 68, 0.2)" },
    LIVE: { label: "LIVE", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.08)", border: "rgba(59, 130, 246, 0.2)" },
    DRAFT: { label: "DRAFT", color: "#94A3B8", bg: "rgba(148, 163, 184, 0.08)", border: "rgba(148, 163, 184, 0.2)" },
    PAID: { label: "PAID", color: "#10B981", bg: "rgba(16, 185, 129, 0.08)", border: "rgba(16, 185, 129, 0.2)" },
    FAILED: { label: "FAILED", color: "#EF4444", bg: "rgba(239, 68, 68, 0.08)", border: "rgba(239, 68, 68, 0.2)" },
    REFUNDED: { label: "REFUNDED", color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.08)", border: "rgba(139, 92, 246, 0.2)" },
    PACKED: { label: "PACKED", color: "#6366F1", bg: "rgba(99, 102, 241, 0.08)", border: "rgba(99, 102, 241, 0.2)" },
    SHIPPED: { label: "SHIPPED", color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.08)", border: "rgba(14, 165, 233, 0.2)" },
    DELIVERED: { label: "DELIVERED", color: "#10B981", bg: "rgba(16, 185, 129, 0.08)", border: "rgba(16, 185, 129, 0.2)" },
    CANCELLED: { label: "CANCELLED", color: "#64748B", bg: "rgba(100, 116, 139, 0.08)", border: "rgba(100, 116, 139, 0.2)" },
    ACCEPTED: { label: "ACCEPTED", color: "#10B981", bg: "rgba(16, 185, 129, 0.08)", border: "rgba(16, 185, 129, 0.2)" },
    COUNTERED: { label: "COUNTERED", color: "#EC4899", bg: "rgba(236, 72, 153, 0.08)", border: "rgba(236, 72, 153, 0.2)" },
    COMPLETED: { label: "COMPLETED", color: "#10B981", bg: "rgba(16, 185, 129, 0.08)", border: "rgba(16, 185, 129, 0.2)" },
};

export default function StatusBadge({ status, size = "md" }) {
    const info = statusMap[status?.toUpperCase()] || { label: status, color: "#94A3B8", bg: "rgba(148, 163, 184, 0.05)", border: "rgba(148, 163, 184, 0.1)" };

    return (
        <span
            className={`inline-flex items-center justify-center rounded-full font-black tracking-[0.15em] border ${size === "sm" ? "text-[8px] px-2 py-0.5" : "text-[10px] px-3 py-1"}`}
            style={{
                color: info.color,
                backgroundColor: info.bg,
                borderColor: info.border,
                backdropFilter: "blur(4px)"
            }}
        >
            {info.label}
        </span>
    );
}
