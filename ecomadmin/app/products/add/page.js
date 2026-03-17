import dbConnect from "@/lib/db";
import Vendor from "@/lib/models/Vendor";
import AddProductForm from "./AddProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function AddProductPage() {
    await dbConnect();
    
    // Fetch only approved vendors to assign products to
    const vendors = await Vendor.find({ kycStatus: "APPROVED" })
        .select('_id businessName')
        .sort({ businessName: 1 });

    const serializedVendors = vendors.map(v => ({
        _id: v._id.toString(),
        businessName: v.businessName
    }));

    return (
        <div className="admin-main-container space-y-6">
            <div>
                <Link href="/products" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors mb-2">
                    <ChevronLeft size={14} /> Back to Products
                </Link>
                <h1 className="heading-lg text-slate-900 font-bold text-2xl">Add New Product</h1>
                <p className="text-sm text-slate-500 mt-1">Create a new product listing assigned to a verified vendor.</p>
            </div>

            <AddProductForm vendors={serializedVendors} />
        </div>
    );
}
