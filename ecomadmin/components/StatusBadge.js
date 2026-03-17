export default function StatusBadge({ status }) {
    const styles = {
        LIVE: "bg-green-500/10 text-green-500 border-green-500/20",
        PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        DRAFT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
        CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
        DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
        APPROVED: "bg-green-500/10 text-green-500 border-green-500/20",
        VERIFIED: "bg-green-500/10 text-green-500 border-green-500/20"
    };

    const currentStyle = styles[status] || "bg-gray-500/10 text-gray-500 border-gray-500/20";

    return (
        <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${currentStyle} whitespace-nowrap`}>
            {status}
        </span>
    );
}
