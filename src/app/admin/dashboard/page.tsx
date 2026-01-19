"use client";

import React, { useState } from "react";
import { useRole } from "@/context/role-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_CLAIMS, Claim } from "@/lib/mock-data";
import { CheckCircle, ImageIcon, Search, BrainCircuit, User, Share2, PlayCircle, Edit2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AdminHeader } from "@/components/admin-header";
import { ImageAnalysisModal } from "@/components/image-analysis-modal";
import { ClaimService } from "@/lib/claim-service";
import { useEffect } from "react";
import { useTranslation } from "@/context/language-context";

export default function B2BDashboard() {
    const { t } = useTranslation();
    const [claims, setClaims] = useState<Claim[]>([]);
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [analysisImagePath, setAnalysisImagePath] = useState("");
    const [isPlayingVideo, setIsPlayingVideo] = useState(false);
    const [activeMainImage, setActiveMainImage] = useState<string | null>(null);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Claim>>({});

    const { role, isInsurer, isAdmin } = useRole();
    const canEdit = isAdmin || isInsurer;

    useEffect(() => {
        if (selectedClaim) {
            setActiveMainImage(selectedClaim.image);
            setIsPlayingVideo(false);
        }
    }, [selectedClaim]);

    useEffect(() => {
        const loadClaims = async () => {
            const data = await ClaimService.getClaims();
            setClaims(data);
        };

        loadClaims();
        window.addEventListener("claims-updated", loadClaims);
        return () => window.removeEventListener("claims-updated", loadClaims);
    }, []);

    const handleExport = async () => {
        try {
            await ClaimService.exportToSQL();
        } catch (err) {
            console.error(err);
            alert("Export failed. Check console.");
        }
    };

    const handleImageClick = (path: string) => {
        setAnalysisImagePath(path);
        setIsAnalysisModalOpen(true);
    };

    const handleEdit = () => {
        if (!canEdit) return;
        if (selectedClaim) {
            setEditForm(selectedClaim);
            setIsEditing(true);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({});
    };

    const handleSave = () => {
        if (!selectedClaim || !editForm) return;

        const updatedClaim = { ...selectedClaim, ...editForm } as Claim;

        // Update local state (claims list)
        setClaims(prev => prev.map(c => c.id === updatedClaim.id ? updatedClaim : c));
        setSelectedClaim(updatedClaim);
        setIsEditing(false);
        // In a real app, call API here
    };

    const handleChange = (field: keyof Claim, value: any) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <AdminHeader />

            {/* Analysis Modal */}
            <ImageAnalysisModal
                isOpen={isAnalysisModalOpen}
                onClose={() => setIsAnalysisModalOpen(false)}
                imagePath={analysisImagePath}
                title={selectedClaim?.policyHolder || t("dashboard.select_claim")}
            />

            <main className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t("common.claims_workbench")}</h1>
                        <p className="text-slate-500 font-medium">B2B Core: AI-Assisted Claims Adjustment</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <BrainCircuit className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{t("common.system_online")}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-250px)]">
                    {/* Left Panel: Claims List */}
                    <Card className="lg:col-span-1 shadow-md border-slate-200 flex flex-col overflow-hidden">
                        <CardHeader className="border-b bg-white">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Search className="w-4 h-4 text-slate-400" /> {t("dashboard.priority_queue")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 pt-4">
                            {claims.map((claim) => (
                                <div
                                    key={claim.id}
                                    onClick={() => setSelectedClaim(claim)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            setSelectedClaim(claim);
                                        }
                                    }}
                                    className={cn(
                                        "p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md group text-start focus:outline-none focus:ring-2 focus:ring-blue-500",
                                        selectedClaim?.id === claim.id
                                            ? "border-[#be123c] bg-rose-50/30"
                                            : "border-slate-50 bg-white"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{claim.id}</span>
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            claim.aiPrediction === "Approve" ? "bg-emerald-500" : "bg-amber-500"
                                        )}></div>
                                    </div>
                                    <h4 className="font-bold text-slate-800 group-hover:text-[#be123c] transition-colors">{claim.policyHolder}</h4>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{claim.type}</span>
                                        <span className="text-sm font-bold text-slate-700">{claim.damageEstimate}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Right Panel: Detail View */}
                    <Card className="lg:col-span-2 shadow-md border-slate-200 overflow-hidden flex flex-col">
                        {selectedClaim ? (
                            <CardContent className="p-0 flex flex-col h-full overflow-y-auto text-start">
                                <div className="p-8 border-b bg-white flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">{selectedClaim.policyHolder}</h2>
                                            <p className="text-xs text-slate-500 font-medium">{selectedClaim.id} • Policy active since 2024</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="border-slate-200 text-slate-600" onClick={handleExport}>
                                            <Share2 className="w-4 h-4 mr-2" /> {t("common.export_data")}
                                        </Button>

                                        {canEdit && (isEditing ? (
                                            <>
                                                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                                                    <Save className="w-4 h-4" /> Save
                                                </Button>
                                                <Button onClick={handleCancel} variant="outline" className="text-slate-600 gap-2">
                                                    <X className="w-4 h-4" /> Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button onClick={handleEdit} variant="outline" className="border-slate-200 text-slate-600 gap-2">
                                                    <Edit2 className="w-4 h-4" /> Edit
                                                </Button>
                                                <Button className="bg-[#be123c] hover:bg-[#9f0f32] text-white font-bold">{t("common.approve")}</Button>
                                            </>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 grid grid-cols-2 gap-8">
                                    {/* Column 1: Evidence */}
                                    <div className="space-y-6">
                                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">Claim Details</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-400 uppercase">Policy Holder</label>
                                                    {isEditing ? (
                                                        <Input
                                                            value={editForm.policyHolder || ""}
                                                            onChange={(e) => handleChange("policyHolder", e.target.value)}
                                                            className="mt-1 font-bold text-slate-900"
                                                        />
                                                    ) : (
                                                        <div className="text-slate-900 font-bold text-lg">{selectedClaim.policyHolder}</div>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-400 uppercase">Damage Estimate</label>
                                                        {isEditing ? (
                                                            <Input
                                                                value={editForm.damageEstimate || ""}
                                                                onChange={(e) => handleChange("damageEstimate", e.target.value)}
                                                                className="mt-1 font-mono"
                                                            />
                                                        ) : (
                                                            <div className="text-slate-900 font-mono font-bold">{selectedClaim.damageEstimate}</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                                                        {isEditing ? (
                                                            <select
                                                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 mt-1"
                                                                value={editForm.status || ""}
                                                                onChange={(e) => handleChange("status", e.target.value)}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Review">Review</option>
                                                                <option value="Approved">Approved</option>
                                                                <option value="Rejected">Rejected</option>
                                                            </select>
                                                        ) : (
                                                            <div className={`mt-1 inline-flex px-2 py-1 rounded text-xs font-bold ${selectedClaim.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                                                                selectedClaim.status === "Review" ? "bg-amber-100 text-amber-700" :
                                                                    "bg-slate-100 text-slate-600"
                                                                }`}>
                                                                {selectedClaim.status}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm">
                                                <ImageIcon className="w-4 h-4 text-slate-400" /> {t("dashboard.evidence_log").toUpperCase()}
                                            </h3>
                                            <div
                                                className="aspect-video bg-slate-100 rounded-2xl relative overflow-hidden border-2 border-slate-100 cursor-zoom-in group shadow-sm"
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => !isPlayingVideo && activeMainImage && handleImageClick(activeMainImage)}
                                                onKeyDown={(e) => {
                                                    if ((e.key === "Enter" || e.key === " ") && !isPlayingVideo && activeMainImage) {
                                                        handleImageClick(activeMainImage);
                                                    }
                                                }}
                                            >
                                                {isPlayingVideo && selectedClaim.video ? (
                                                    <video
                                                        src={selectedClaim.video}
                                                        className="w-full h-full object-cover"
                                                        controls
                                                        autoPlay
                                                        onEnded={() => setIsPlayingVideo(false)}
                                                    />
                                                ) : (
                                                    <img
                                                        src={activeMainImage || selectedClaim.image}
                                                        alt="Damage Evidence"
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                )}

                                                {!isPlayingVideo && (
                                                    <>
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold text-slate-800 flex items-center gap-2 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                                                                <Search className="w-4 h-4 text-[#be123c]" /> AI Analysis Modal
                                                            </div>
                                                        </div>
                                                        <div className="absolute bottom-4 left-4 bg-[#be123c] text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase shadow-lg">
                                                            Vision Mesh v4.0
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Video Evidence Section */}
                                            {selectedClaim.video && (
                                                <div
                                                    className={cn(
                                                        "mt-4 bg-slate-900 rounded-2xl p-4 flex items-center justify-between group cursor-pointer transition-colors",
                                                        isPlayingVideo ? "ring-2 ring-[#be123c]" : "hover:bg-slate-800"
                                                    )}
                                                    onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                                            isPlayingVideo ? "bg-[#be123c]" : "bg-white/10 group-hover:bg-[#be123c]"
                                                        )}>
                                                            <PlayCircle className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-white">Dashcam Footage</div>
                                                            <div className="text-xs text-slate-400">00:14 • 1080p Recorded</div>
                                                        </div>
                                                    </div>
                                                    <Button size="sm" variant="ghost" className="text-white hover:text-[#be123c]">
                                                        {isPlayingVideo ? "Playing" : "Watch"}
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Gallery thumbnails */}
                                            <div className="grid grid-cols-3 gap-3 mt-3">
                                                {selectedClaim.gallery?.map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            setActiveMainImage(img);
                                                            setIsPlayingVideo(false);
                                                        }}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" || e.key === " ") {
                                                                setActiveMainImage(img);
                                                                setIsPlayingVideo(false);
                                                            }
                                                        }}
                                                        className="aspect-square rounded-xl overflow-hidden border-2 border-slate-100 cursor-zoom-in hover:border-[#be123c] hover:opacity-90 transition-all group relative focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <img src={img} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 transition-all hover:border-slate-300">
                                            <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-tight">Customer Statement</h4>
                                            {isEditing ? (
                                                <textarea
                                                    className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={editForm.statement || ""}
                                                    onChange={(e) => handleChange("statement", e.target.value)}
                                                />
                                            ) : (
                                                <p className="text-slate-600 text-sm italic leading-relaxed">
                                                    "{selectedClaim.statement || "No statement recorded."}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Column 2: AI Co-Pilot details */}
                                    <div className="space-y-6">
                                        <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl">
                                            <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-4">
                                                <BrainCircuit className="w-5 h-5 text-blue-600" /> {t("dashboard.mesh_insights")}
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-blue-700">{t("dashboard.vision_confidence")}</span>
                                                    <span className="font-bold text-blue-900">{selectedClaim.aiConfidence}%</span>
                                                </div>
                                                <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-blue-600 h-full" style={{ width: `${selectedClaim.aiConfidence}%` }}></div>
                                                </div>
                                                <div className="pt-2">
                                                    <div className="flex justify-between items-center text-xs mb-2 text-start">
                                                        <span className="text-blue-700 font-bold uppercase">{t("dashboard.fraud_correlation")}</span>
                                                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">{t("dashboard.clean")}</span>
                                                    </div>
                                                    <p className="text-xs text-blue-700/80 leading-relaxed italic border-l-2 border-blue-200 pl-3 text-start">
                                                        "No duplicate claims found in historical database for this plate/VIN. VIN matches the sticker in evidence photo."
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-2xl">
                                            <h3 className="font-bold text-[#be123c] flex items-center gap-2 mb-3 tracking-tight">
                                                {t("dashboard.decision_support")}
                                            </h3>
                                            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                                {selectedClaim.aiPrediction === "Approve"
                                                    ? "AI recommends Instant Approval. The detected damage aligns perfectly with the policy scope and local labor rates."
                                                    : "AI flags this for manual review. Structural deformation detected is significantly higher than user-reported impact velocity."}
                                            </p>
                                            {selectedClaim.aiPrediction === "Approve" && (
                                                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl flex items-center gap-3 text-xs font-bold border border-emerald-100">
                                                    <CheckCircle className="w-5 h-5" /> {t("dashboard.auto_settlement")} (SAR {selectedClaim.damageEstimate})
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 flex-col bg-slate-50/50">
                                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                                    <BrainCircuit className="w-10 h-10 text-slate-200" />
                                </div>
                                <h3 className="font-bold text-slate-600 mb-1">{t("dashboard.select_claim")}</h3>
                                <p className="text-xs text-slate-400 font-medium">{t("dashboard.inspection_prompt")}</p>
                            </div>
                        )}
                    </Card>
                </div>
            </main>
        </div>
    );
}
