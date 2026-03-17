import dbConnect from "@/lib/db";
import Vendor from "@/lib/models/Vendor";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
    const session = await auth();
    if (!session || session.user.role !== "VENDOR") {
        redirect("/login");
    }

    await dbConnect();
    const vendor = await Vendor.findOne({ userId: session.user.id }).lean();

    if (!vendor) {
        return <div className="p-8 text-center text-slate-500">Vendor profile not found. Complete KYC first.</div>;
    }

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <header className="space-y-1.5 flex items-center justify-between">
                <div>
                    <h1 className="heading-xl tracking-tight text-slate-900 flex items-center gap-3">
                        <Settings className="text-primary" size={32} /> 
                        Store Profile
                    </h1>
                    <p className="text-slate-500 text-[15px] font-medium">Manage your storefront appearance on the main application.</p>
                </div>
            </header>
            
            <SettingsForm initialData={JSON.parse(JSON.stringify(vendor))} />
        </div>
    );
}
