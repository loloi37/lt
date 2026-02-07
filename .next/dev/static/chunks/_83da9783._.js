(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/types/memorial.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// types/memorial.ts - UPDATED with Step 9 for Videos
__turbopack_context__.s([
    "STEP_NAMES",
    ()=>STEP_NAMES,
    "TOTAL_STEPS",
    ()=>TOTAL_STEPS
]);
const TOTAL_STEPS = 10; // UPDATED from 9 to 10
const STEP_NAMES = [
    'Basic Information',
    'Early Life & Childhood',
    'Career & Education',
    'Relationships & Family',
    'Personality, Values & Passions',
    'Full Life Story',
    'Memories & Stories',
    'Photos & Legacy',
    'Videos',
    'Review & Publish' // UPDATED - now step 10
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wizard/ProgressBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProgressBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$memorial$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/memorial.ts [app-client] (ecmascript)");
// components/wizard/ProgressBar.tsx
'use client';
;
;
function ProgressBar({ currentStep, completedSteps, onStepClick }) {
    const completionPercentage = Math.round(completedSteps.length / (__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$memorial$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOTAL_STEPS"] - 1) * 100);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "py-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto px-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-medium text-charcoal",
                                    children: [
                                        "Step ",
                                        currentStep,
                                        " of ",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$memorial$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOTAL_STEPS"]
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/wizard/ProgressBar.tsx",
                                    lineNumber: 19,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-charcoal/40",
                                    children: "•"
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/ProgressBar.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-charcoal/60",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$memorial$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STEP_NAMES"][currentStep - 1]
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/ProgressBar.tsx",
                                    lineNumber: 23,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/wizard/ProgressBar.tsx",
                            lineNumber: 18,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-charcoal/40",
                            children: [
                                completionPercentage,
                                "% complete"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/wizard/ProgressBar.tsx",
                            lineNumber: 27,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/wizard/ProgressBar.tsx",
                    lineNumber: 17,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative h-2 bg-sand/30 rounded-full overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-y-0 left-0 bg-gradient-to-r from-sage to-terracotta rounded-full transition-all duration-500 ease-out",
                        style: {
                            width: `${completionPercentage}%`
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/ProgressBar.tsx",
                        lineNumber: 33,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/wizard/ProgressBar.tsx",
                    lineNumber: 32,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mt-4",
                    children: Array.from({
                        length: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$memorial$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOTAL_STEPS"]
                    }).map((_, idx)=>{
                        const stepNumber = idx + 1;
                        const isCompleted = completedSteps.includes(stepNumber);
                        const isCurrent = stepNumber === currentStep;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onStepClick?.(stepNumber),
                            className: "flex flex-col items-center gap-1 group cursor-pointer hover:scale-110 transition-transform",
                            title: `${isCompleted ? 'Completed: ' : ''}${__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$memorial$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STEP_NAMES"][idx]}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${isCompleted ? 'bg-sage text-ivory group-hover:bg-sage/80' : isCurrent ? 'bg-terracotta text-ivory ring-4 ring-terracotta/20 group-hover:ring-terracotta/30' : 'bg-sand/40 text-charcoal/40 group-hover:bg-sand/60'}`,
                                    children: isCompleted ? '✓' : stepNumber
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/ProgressBar.tsx",
                                    lineNumber: 52,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `hidden md:block text-[10px] text-center max-w-[60px] leading-tight ${isCurrent ? 'text-charcoal font-medium' : 'text-charcoal/40'}`,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$memorial$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STEP_NAMES"][idx].split(' ')[0]
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/ProgressBar.tsx",
                                    lineNumber: 62,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, stepNumber, true, {
                            fileName: "[project]/components/wizard/ProgressBar.tsx",
                            lineNumber: 46,
                            columnNumber: 29
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/wizard/ProgressBar.tsx",
                    lineNumber: 39,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/wizard/ProgressBar.tsx",
            lineNumber: 16,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/wizard/ProgressBar.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, this);
}
_c = ProgressBar;
var _c;
__turbopack_context__.k.register(_c, "ProgressBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wizard/PathCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/wizard/PathCard.tsx
__turbopack_context__.s([
    "default",
    ()=>PathCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-play.js [app-client] (ecmascript) <export default as PlayCircle>");
;
;
function PathCard({ id, title, description, status, onClick }) {
    const isLocked = status === 'locked';
    const statusStyles = {
        locked: "opacity-50 cursor-not-allowed border-sand/20 bg-sand/5",
        empty: "border-sand/40 bg-white hover:border-sage/60 hover:shadow-md",
        in_progress: "border-sage/40 bg-sage/5 hover:border-sage/60 hover:shadow-md",
        completed: "border-sage bg-white hover:shadow-md"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        disabled: isLocked,
        onClick: ()=>onClick(id),
        className: `relative w-full p-8 rounded-2xl border-2 transition-all text-left flex flex-col h-full ${statusStyles[status]}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-start mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `p-3 rounded-xl ${isLocked ? 'bg-sand/20' : 'bg-ivory'}`,
                        children: [
                            status === 'completed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                className: "text-sage",
                                size: 24
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/PathCard.tsx",
                                lineNumber: 31,
                                columnNumber: 48
                            }, this),
                            status === 'in_progress' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__["PlayCircle"], {
                                className: "text-sage",
                                size: 24
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/PathCard.tsx",
                                lineNumber: 32,
                                columnNumber: 50
                            }, this),
                            status === 'empty' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                                className: "text-sand",
                                size: 24
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/PathCard.tsx",
                                lineNumber: 33,
                                columnNumber: 44
                            }, this),
                            status === 'locked' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                className: "text-charcoal/40",
                                size: 24
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/PathCard.tsx",
                                lineNumber: 34,
                                columnNumber: 45
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/PathCard.tsx",
                        lineNumber: 30,
                        columnNumber: 17
                    }, this),
                    status === 'completed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] uppercase tracking-widest text-sage font-bold",
                        children: "Chapter Complete"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/PathCard.tsx",
                        lineNumber: 37,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/PathCard.tsx",
                lineNumber: 29,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "font-serif text-2xl text-charcoal mb-2",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/wizard/PathCard.tsx",
                lineNumber: 41,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-charcoal/60 leading-relaxed mb-8 flex-1",
                children: description
            }, void 0, false, {
                fileName: "[project]/components/wizard/PathCard.tsx",
                lineNumber: 42,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-auto pt-4 border-t border-sand/20 flex items-center justify-between",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs font-medium text-charcoal/40",
                    children: isLocked ? "Complete 2 other paths to unlock" : "Step inside →"
                }, void 0, false, {
                    fileName: "[project]/components/wizard/PathCard.tsx",
                    lineNumber: 45,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/wizard/PathCard.tsx",
                lineNumber: 44,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wizard/PathCard.tsx",
        lineNumber: 24,
        columnNumber: 9
    }, this);
}
_c = PathCard;
var _c;
__turbopack_context__.k.register(_c, "PathCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/paths-logic.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/paths-logic.ts
__turbopack_context__.s([
    "getPathStatus",
    ()=>getPathStatus
]);
const getPathStatus = (data, pathId)=>{
    switch(pathId){
        case 'facts':
            // Path 1: The Facts (Step 1)
            if (data.step1.fullName && data.step1.birthDate) return 'completed';
            if (data.step1.fullName || data.step1.birthDate) return 'in_progress';
            return 'empty';
        case 'body':
            // Path 2: The Body (Steps 2, 3, 4)
            const hasChildhood = !!data.step2.childhoodHome;
            const hasCareer = data.step3.occupations.length > 0;
            const hasFamily = data.step4.partners.length > 0 || data.step4.children.length > 0;
            if (hasChildhood && hasCareer && hasFamily) return 'completed';
            if (hasChildhood || hasCareer || hasFamily) return 'in_progress';
            return 'empty';
        case 'soul':
            // Path 3: The Soul (Steps 5, 6)
            const hasTraits = data.step5.personalityTraits.length >= 3;
            const hasBio = data.step6.biography.length > 200;
            if (hasTraits && hasBio) return 'completed';
            if (hasTraits || hasBio) return 'in_progress';
            return 'empty';
        case 'presence':
            // Path 4: The Presence (Steps 8, 9)
            // MASTERSTROKE LOGIC: Check if at least 2 other paths are completed
            const completedPaths = [
                'facts',
                'body',
                'soul'
            ].filter((id)=>getPathStatus(data, id) === 'completed').length;
            if (completedPaths < 2) return 'locked';
            const hasPhotos = data.step8.gallery.length > 0;
            const hasVideos = data.step9.videos.length > 0;
            if (hasPhotos && hasVideos) return 'completed';
            if (hasPhotos || hasVideos) return 'in_progress';
            return 'empty';
        default:
            return 'empty';
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wizard/Step1BasicInfo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Step1BasicInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/quote.js [app-client] (ecmascript) <export default as Quote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
;
var _s = __turbopack_context__.k.signature();
// components/wizard/Step1BasicInfo.tsx
'use client';
;
;
function Step1BasicInfo({ data, onUpdate, onNext }) {
    _s();
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleChange = (field, value)=>{
        onUpdate({
            ...data,
            [field]: value
        });
    };
    const handlePhotoUpload = (e)=>{
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = ()=>{
                onUpdate({
                    ...data,
                    profilePhoto: file,
                    profilePhotoPreview: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };
    const removePhoto = ()=>{
        onUpdate({
            ...data,
            profilePhoto: null,
            profilePhotoPreview: null
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const calculateAge = ()=>{
        if (!data.birthDate) return null;
        const birth = new Date(data.birthDate);
        const end = data.isStillLiving ? new Date() : data.deathDate ? new Date(data.deathDate) : new Date();
        const years = end.getFullYear() - birth.getFullYear();
        return years;
    };
    const isValid = ()=>{
        return data.fullName.trim() !== '' && data.birthDate !== '';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        autoComplete: "off",
        onSubmit: (e)=>{
            e.preventDefault();
            onNext();
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                className: "hidden",
                "aria-hidden": "true",
                autoComplete: "off",
                name: "hidden_dummy_input",
                tabIndex: -1
            }, void 0, false, {
                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                lineNumber: 61,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-3xl mx-auto px-6 pt-20 pb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "font-serif text-4xl text-charcoal mb-3",
                                children: "Let's Start with the Basics"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                lineNumber: 65,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-charcoal/60 text-lg",
                                children: "We'll begin with the essential information. Don't worry, you can always come back and edit this later."
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                lineNumber: 68,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                        lineNumber: 64,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-charcoal mb-2",
                                        children: [
                                            "Full Name ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-terracotta",
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 76,
                                                columnNumber: 39
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 75,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                className: "absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40",
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 79,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                name: "memorial_subject_full_name",
                                                autoComplete: "off",
                                                "data-lpignore": "true",
                                                "data-form-type": "other",
                                                value: data.fullName,
                                                onChange: (e)=>handleChange('fullName', e.target.value),
                                                placeholder: "e.g., Eleanor Marie Thompson",
                                                className: "w-full pl-12 pr-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 80,
                                                columnNumber: 28
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 78,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-charcoal/40 mt-1",
                                        children: "Their full legal name or the name they were known by"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 93,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                lineNumber: 74,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-charcoal mb-2",
                                        children: [
                                            "Birth Date ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-terracotta",
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 98,
                                                columnNumber: 40
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 97,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                className: "absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40",
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 101,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                name: "memorial_subject_birth_date",
                                                autoComplete: "off",
                                                value: data.birthDate,
                                                onChange: (e)=>handleChange('birthDate', e.target.value),
                                                className: "w-full pl-12 pr-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 102,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 100,
                                        columnNumber: 25
                                    }, this),
                                    calculateAge() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-sage mt-1",
                                        children: data.isStillLiving ? `Currently ${calculateAge()} years old` : `Lived ${calculateAge()} years`
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 112,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                lineNumber: 96,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 p-4 bg-sand/10 rounded-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        id: "stillLiving",
                                        name: "memorial_subject_is_living",
                                        checked: data.isStillLiving,
                                        onChange: (e)=>{
                                            const isChecked = e.target.checked;
                                            onUpdate({
                                                ...data,
                                                isStillLiving: isChecked,
                                                deathDate: isChecked ? null : data.deathDate,
                                                deathPlace: isChecked ? '' : data.deathPlace
                                            });
                                        },
                                        className: "w-5 h-5 text-sage border-sand/40 rounded focus:ring-sage/30 cursor-pointer"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 119,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "stillLiving",
                                        className: "text-sm text-charcoal cursor-pointer",
                                        children: "This person is still living"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 135,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                lineNumber: 118,
                                columnNumber: 21
                            }, this),
                            !data.isStillLiving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-charcoal mb-2",
                                        children: "Death Date"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 142,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                className: "absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40",
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 146,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                name: "memorial_subject_death_date",
                                                autoComplete: "off",
                                                value: data.deathDate || '',
                                                onChange: (e)=>handleChange('deathDate', e.target.value),
                                                className: "w-full pl-12 pr-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 147,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 145,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                lineNumber: 141,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-charcoal mb-2",
                                        children: "Birth Place"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 160,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                className: "absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40",
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 164,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                name: "memorial_subject_birth_place",
                                                autoComplete: "off",
                                                value: data.birthPlace,
                                                onChange: (e)=>handleChange('birthPlace', e.target.value),
                                                placeholder: "e.g., Charleston, South Carolina",
                                                className: "w-full pl-12 pr-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 165,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 163,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-charcoal/40 mt-1",
                                        children: "City and state/country where they were born"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 175,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                lineNumber: 159,
                                columnNumber: 21
                            }, this),
                            !data.isStillLiving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-charcoal mb-2",
                                        children: "Death Place"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 180,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                className: "absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40",
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 184,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                name: "memorial_subject_death_place",
                                                autoComplete: "off",
                                                value: data.deathPlace,
                                                onChange: (e)=>handleChange('deathPlace', e.target.value),
                                                placeholder: "e.g., Boston, Massachusetts",
                                                className: "w-full pl-12 pr-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 185,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 183,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                lineNumber: 179,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-charcoal mb-2",
                                        children: "Profile Photo"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 199,
                                        columnNumber: 25
                                    }, this),
                                    !data.profilePhotoPreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>fileInputRef.current?.click(),
                                        className: "border-2 border-dashed border-sand/40 rounded-xl p-8 text-center cursor-pointer hover:border-sage/40 hover:bg-sage/5 transition-all",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                className: "mx-auto mb-3 text-charcoal/40",
                                                size: 32
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 207,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-charcoal/60 mb-1",
                                                children: "Click to upload or drag and drop"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 208,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-charcoal/40",
                                                children: "PNG, JPG up to 10MB"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 211,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 203,
                                        columnNumber: 29
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-48 h-48 mx-auto rounded-2xl overflow-hidden border-4 border-sand/30",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: data.profilePhotoPreview,
                                                    alt: "Profile preview",
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 217,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: removePhoto,
                                                className: "absolute top-2 right-2 p-2 bg-charcoal/80 hover:bg-charcoal rounded-full transition-colors",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    size: 16,
                                                    className: "text-ivory"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                    lineNumber: 228,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 224,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 216,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: fileInputRef,
                                        type: "file",
                                        name: "memorial_subject_profile_photo",
                                        accept: "image/*",
                                        onChange: handlePhotoUpload,
                                        className: "hidden"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 232,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-charcoal/40 mt-2 text-center",
                                        children: "You can add more photos later in the gallery"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 240,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                lineNumber: 198,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-charcoal mb-2",
                                        children: "One-Line Epitaph"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 246,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__["Quote"], {
                                                className: "absolute left-4 top-4 text-charcoal/40",
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 250,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: data.epitaph,
                                                name: "memorial_subject_epitaph",
                                                autoComplete: "off",
                                                onChange: (e)=>handleChange('epitaph', e.target.value),
                                                placeholder: "A sentence that captures their essence...",
                                                maxLength: 200,
                                                rows: 3,
                                                className: "w-full pl-12 pr-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 251,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 249,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center mt-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-charcoal/40",
                                                children: "Optional but recommended"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 263,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-charcoal/40",
                                                children: [
                                                    data.epitaph.length,
                                                    "/200"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 264,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 262,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 p-3 bg-sage/5 rounded-lg border border-sage/20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-medium text-sage mb-2",
                                                children: "Examples:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 267,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "space-y-1 text-xs text-charcoal/60",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: '• "She taught us how to see beauty in ordinary moments"'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                        lineNumber: 269,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: '• "A gentle soul who lived with fierce purpose"'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                        lineNumber: 270,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: '• "He turned strangers into family wherever he went"'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                        lineNumber: 271,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                                lineNumber: 268,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                        lineNumber: 266,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                                lineNumber: 245,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                        lineNumber: 73,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-12 flex gap-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "data-tutorial": "save-continue",
                            type: "submit",
                            disabled: !isValid(),
                            className: `flex-1 py-4 px-6 rounded-xl font-medium transition-all ${isValid() ? 'bg-terracotta hover:bg-terracotta/90 text-ivory' : 'bg-sand/30 text-charcoal/40 cursor-not-allowed'}`,
                            children: "Save & Continue →"
                        }, void 0, false, {
                            fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                            lineNumber: 278,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                        lineNumber: 277,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "text-sm text-charcoal/60 hover:text-charcoal transition-colors",
                            children: "Save Draft & Exit"
                        }, void 0, false, {
                            fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                            lineNumber: 292,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                        lineNumber: 291,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
                lineNumber: 63,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wizard/Step1BasicInfo.tsx",
        lineNumber: 59,
        columnNumber: 9
    }, this);
}
_s(Step1BasicInfo, "YQqvMxdmg33cmOXmQcOjJm+FLVI=");
_c = Step1BasicInfo;
var _c;
__turbopack_context__.k.register(_c, "Step1BasicInfo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wizard/Step2Childhood.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Step2Childhood
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/graduation-cap.js [app-client] (ecmascript) <export default as GraduationCap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
;
var _s = __turbopack_context__.k.signature();
// components/wizard/Step2Childhood.tsx
'use client';
;
;
const PERSONALITY_OPTIONS = [
    'Curious',
    'Shy',
    'Adventurous',
    'Studious',
    'Athletic',
    'Creative',
    'Rebellious',
    'Compassionate',
    'Playful',
    'Thoughtful',
    'Bold',
    'Gentle',
    'Energetic',
    'Calm',
    'Funny',
    'Serious',
    'Social',
    'Independent',
    'Helpful',
    'Imaginative'
];
function Step2Childhood({ data, onUpdate, onNext, onBack }) {
    _s();
    const [newInterest, setNewInterest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const photoInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleChange = (field, value)=>{
        onUpdate({
            ...data,
            [field]: value
        });
    };
    const handleSchoolChange = (school, value)=>{
        onUpdate({
            ...data,
            schools: {
                ...data.schools,
                [school]: value
            }
        });
    };
    const togglePersonality = (trait)=>{
        const current = data.childhoodPersonality;
        if (current.includes(trait)) {
            handleChange('childhoodPersonality', current.filter((t)=>t !== trait));
        } else {
            handleChange('childhoodPersonality', [
                ...current,
                trait
            ]);
        }
    };
    const addInterest = ()=>{
        if (newInterest.trim() && !data.earlyInterests.includes(newInterest.trim())) {
            handleChange('earlyInterests', [
                ...data.earlyInterests,
                newInterest.trim()
            ]);
            setNewInterest('');
        }
    };
    const removeInterest = (interest)=>{
        handleChange('earlyInterests', data.earlyInterests.filter((i)=>i !== interest));
    };
    const handlePhotosUpload = (e)=>{
        const files = Array.from(e.target.files || []);
        files.forEach((file)=>{
            const reader = new FileReader();
            reader.onloadend = ()=>{
                const newPhoto = {
                    file,
                    preview: reader.result,
                    caption: '',
                    year: ''
                };
                handleChange('childhoodPhotos', [
                    ...data.childhoodPhotos,
                    newPhoto
                ]);
            };
            reader.readAsDataURL(file);
        });
    };
    const removePhoto = (index)=>{
        handleChange('childhoodPhotos', data.childhoodPhotos.filter((_, i)=>i !== index));
    };
    const updatePhotoCaption = (index, caption)=>{
        const updated = [
            ...data.childhoodPhotos
        ];
        updated[index] = {
            ...updated[index],
            caption
        };
        handleChange('childhoodPhotos', updated);
    };
    const updatePhotoYear = (index, year)=>{
        const updated = [
            ...data.childhoodPhotos
        ];
        updated[index] = {
            ...updated[index],
            year
        };
        handleChange('childhoodPhotos', updated);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-3xl mx-auto px-6 py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-serif text-4xl text-charcoal mb-3",
                        children: "Early Life & Childhood"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                        lineNumber: 94,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-charcoal/60 text-lg",
                        children: "Tell us about their formative years. You can skip any section and come back later."
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                        lineNumber: 97,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                lineNumber: 93,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                        size: 18,
                                        className: "text-sage"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 106,
                                        columnNumber: 25
                                    }, this),
                                    "Where did they grow up?"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 105,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: data.childhoodHome,
                                onChange: (e)=>handleChange('childhoodHome', e.target.value),
                                placeholder: "Describe their childhood home and neighborhood...",
                                rows: 4,
                                className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 109,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 text-xs text-charcoal/40 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "💡 Prompts to help you:"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 117,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "• What was their neighborhood like?"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 118,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "• What kind of home did they live in?"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 119,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "• City or countryside?"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 120,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 116,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                        lineNumber: 104,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 127,
                                        columnNumber: 25
                                    }, this),
                                    "Tell us about their family"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 126,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: data.familyBackground,
                                onChange: (e)=>handleChange('familyBackground', e.target.value),
                                placeholder: "Describe their family life and upbringing...",
                                rows: 5,
                                className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 130,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 text-xs text-charcoal/40 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "💡 Prompts:"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 138,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "• Who raised them?"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 139,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "• How many siblings?"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 140,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "• What was family life like?"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 141,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 137,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                        lineNumber: 125,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__["GraduationCap"], {
                                        size: 18,
                                        className: "text-sage"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 148,
                                        columnNumber: 25
                                    }, this),
                                    "Where did they go to school?"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 147,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: data.schools.elementary,
                                            onChange: (e)=>handleSchoolChange('elementary', e.target.value),
                                            placeholder: "Elementary/Primary school",
                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                        }, void 0, false, {
                                            fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                            lineNumber: 153,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 152,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: data.schools.highSchool,
                                            onChange: (e)=>handleSchoolChange('highSchool', e.target.value),
                                            placeholder: "High school",
                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                        }, void 0, false, {
                                            fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                            lineNumber: 162,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 161,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: data.schools.college,
                                            onChange: (e)=>handleSchoolChange('college', e.target.value),
                                            placeholder: "College/University (with degree if applicable)",
                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                        }, void 0, false, {
                                            fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                            lineNumber: 171,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 170,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: data.schools.additionalEducation,
                                            onChange: (e)=>handleSchoolChange('additionalEducation', e.target.value),
                                            placeholder: "Additional education (optional)",
                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                        }, void 0, false, {
                                            fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                            lineNumber: 180,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 179,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 151,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                        lineNumber: 146,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 194,
                                        columnNumber: 25
                                    }, this),
                                    "What were they like as a child?"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 193,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mb-4",
                                children: "Select 3-5 traits that best describe them"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 197,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-4 gap-3",
                                children: PERSONALITY_OPTIONS.map((trait)=>{
                                    const isSelected = data.childhoodPersonality.includes(trait);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>togglePersonality(trait),
                                        className: `px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${isSelected ? 'bg-sage text-ivory border-sage' : 'bg-white text-charcoal border-sand/40 hover:border-sage/40 hover:bg-sage/5'}`,
                                        children: trait
                                    }, trait, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 203,
                                        columnNumber: 33
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 199,
                                columnNumber: 21
                            }, this),
                            data.childhoodPersonality.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-sage mt-3",
                                children: [
                                    "Selected: ",
                                    data.childhoodPersonality.length,
                                    " trait",
                                    data.childhoodPersonality.length !== 1 ? 's' : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 218,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                        lineNumber: 192,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 227,
                                        columnNumber: 25
                                    }, this),
                                    "What did they love doing?"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 226,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: newInterest,
                                        onChange: (e)=>setNewInterest(e.target.value),
                                        onKeyPress: (e)=>e.key === 'Enter' && (e.preventDefault(), addInterest()),
                                        placeholder: "e.g., reading, sports, music...",
                                        className: "flex-1 px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 232,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: addInterest,
                                        className: "px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-xl transition-all flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                                lineNumber: 244,
                                                columnNumber: 29
                                            }, this),
                                            "Add"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 240,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 231,
                                columnNumber: 21
                            }, this),
                            data.earlyInterests.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: data.earlyInterests.map((interest, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 px-4 py-2 bg-terracotta/10 text-terracotta border border-terracotta/30 rounded-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm",
                                                children: interest
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                                lineNumber: 256,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>removeInterest(interest),
                                                className: "hover:bg-terracotta/20 rounded-full p-1 transition-all",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                                lineNumber: 257,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 252,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 250,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 p-3 bg-sage/5 rounded-lg border border-sage/20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-charcoal/60",
                                    children: "💡 Examples: reading, baseball, piano, drawing, building things, nature walks, cooking with grandma"
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                    lineNumber: 269,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 268,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                        lineNumber: 225,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                        size: 18,
                                        className: "text-sage"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 278,
                                        columnNumber: 25
                                    }, this),
                                    "Upload Childhood Photos (Optional)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 277,
                                columnNumber: 21
                            }, this),
                            data.childhoodPhotos.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>photoInputRef.current?.click(),
                                className: "border-2 border-dashed border-sand/40 rounded-xl p-8 text-center cursor-pointer hover:border-sage/40 hover:bg-sage/5 transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                        className: "mx-auto mb-3 text-charcoal/40",
                                        size: 32
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 287,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-charcoal/60 mb-1",
                                        children: "Click to upload childhood photos"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 288,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-charcoal/40",
                                        children: "You can select multiple photos"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 291,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 283,
                                columnNumber: 25
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 md:grid-cols-3 gap-4 mb-4",
                                        children: data.childhoodPhotos.map((photo, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "aspect-square rounded-xl overflow-hidden bg-sand/20 border border-sand/30",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: photo.preview,
                                                            alt: `Childhood photo ${idx + 1}`,
                                                            className: "w-full h-full object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                                            lineNumber: 301,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                                        lineNumber: 300,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>removePhoto(idx),
                                                        className: "absolute top-2 right-2 p-2 bg-charcoal/80 hover:bg-charcoal rounded-full transition-all opacity-0 group-hover:opacity-100",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            size: 14,
                                                            className: "text-ivory"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                                            lineNumber: 311,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                                        lineNumber: 307,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 space-y-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: photo.caption,
                                                                onChange: (e)=>updatePhotoCaption(idx, e.target.value),
                                                                placeholder: "Caption (optional)",
                                                                className: "w-full px-2 py-1 text-xs border border-sand/40 rounded focus:outline-none focus:ring-1 focus:ring-sage/30"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                                                lineNumber: 316,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: photo.year,
                                                                onChange: (e)=>updatePhotoYear(idx, e.target.value),
                                                                placeholder: "Year (optional)",
                                                                className: "w-full px-2 py-1 text-xs border border-sand/40 rounded focus:outline-none focus:ring-1 focus:ring-sage/30"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                                                lineNumber: 323,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                                        lineNumber: 315,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                                lineNumber: 299,
                                                columnNumber: 37
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 297,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>photoInputRef.current?.click(),
                                        className: "w-full py-3 border-2 border-dashed border-sand/40 rounded-xl text-sm text-charcoal/60 hover:border-sage/40 hover:bg-sage/5 transition-all",
                                        children: "+ Add More Photos"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                        lineNumber: 335,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: photoInputRef,
                                type: "file",
                                accept: "image/*",
                                multiple: true,
                                onChange: handlePhotosUpload,
                                className: "hidden"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                                lineNumber: 344,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                        lineNumber: 276,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                lineNumber: 102,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-12 flex gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onBack,
                        className: "px-6 py-4 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all font-medium",
                        children: "← Back"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                        lineNumber: 357,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onNext,
                        className: "flex-1 bg-terracotta hover:bg-terracotta/90 text-ivory py-4 px-6 rounded-xl font-medium transition-all",
                        children: "Save & Continue →"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step2Childhood.tsx",
                        lineNumber: 363,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                lineNumber: 356,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onNext,
                    className: "text-sm text-charcoal/60 hover:text-charcoal transition-colors",
                    children: "I'll fill this in later →"
                }, void 0, false, {
                    fileName: "[project]/components/wizard/Step2Childhood.tsx",
                    lineNumber: 373,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/wizard/Step2Childhood.tsx",
                lineNumber: 372,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wizard/Step2Childhood.tsx",
        lineNumber: 92,
        columnNumber: 9
    }, this);
}
_s(Step2Childhood, "+zvVxvpIUqjQJeerpu0J1pD8tOI=");
_c = Step2Childhood;
var _c;
__turbopack_context__.k.register(_c, "Step2Childhood");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wizard/Step3Career.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Step3Career
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.js [app-client] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/graduation-cap.js [app-client] (ecmascript) <export default as GraduationCap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
;
var _s = __turbopack_context__.k.signature();
// components/wizard/Step3Career.tsx
'use client';
;
;
function Step3Career({ data, onUpdate, onNext, onBack }) {
    _s();
    const [newHighlight, setNewHighlight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleChange = (field, value)=>{
        onUpdate({
            ...data,
            [field]: value
        });
    };
    const handleEducationChange = (field, value)=>{
        onUpdate({
            ...data,
            education: {
                ...data.education,
                [field]: value
            }
        });
    };
    // Occupation Management
    const addOccupation = ()=>{
        const newOccupation = {
            id: `occ-${Date.now()}`,
            title: '',
            company: '',
            yearsFrom: '',
            yearsTo: '',
            description: ''
        };
        handleChange('occupations', [
            ...data.occupations,
            newOccupation
        ]);
    };
    const removeOccupation = (id)=>{
        handleChange('occupations', data.occupations.filter((occ)=>occ.id !== id));
    };
    const updateOccupation = (id, field, value)=>{
        handleChange('occupations', data.occupations.map((occ)=>occ.id === id ? {
                ...occ,
                [field]: value
            } : occ));
    };
    // Career Highlights Management
    const addHighlight = ()=>{
        if (newHighlight.trim()) {
            handleChange('careerHighlights', [
                ...data.careerHighlights,
                newHighlight.trim()
            ]);
            setNewHighlight('');
        }
    };
    const removeHighlight = (index)=>{
        handleChange('careerHighlights', data.careerHighlights.filter((_, i)=>i !== index));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-3xl mx-auto px-6 py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-serif text-4xl text-charcoal mb-3",
                        children: "Career & Education"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step3Career.tsx",
                        lineNumber: 70,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-charcoal/60 text-lg",
                        children: "Tell us about their professional life and educational achievements."
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step3Career.tsx",
                        lineNumber: 73,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step3Career.tsx",
                lineNumber: 69,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step3Career.tsx",
                                        lineNumber: 82,
                                        columnNumber: 25
                                    }, this),
                                    "What did they do for work?"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                lineNumber: 81,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    data.occupations.map((occupation, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative",
                                            children: [
                                                data.occupations.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>removeOccupation(occupation.id),
                                                    className: "absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all",
                                                    title: "Remove this job",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step3Career.tsx",
                                                        lineNumber: 99,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step3Career.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "pr-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: occupation.title,
                                                        onChange: (e)=>updateOccupation(occupation.id, 'title', e.target.value),
                                                        placeholder: "Job title (e.g., High School English Teacher)",
                                                        className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all font-medium"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step3Career.tsx",
                                                        lineNumber: 104,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step3Career.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: occupation.company,
                                                    onChange: (e)=>updateOccupation(occupation.id, 'company', e.target.value),
                                                    placeholder: "Company/Organization (e.g., Boston Public Schools)",
                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step3Career.tsx",
                                                    lineNumber: 113,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs text-charcoal/60 mb-1",
                                                                    children: "From"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step3Career.tsx",
                                                                    lineNumber: 123,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: occupation.yearsFrom,
                                                                    onChange: (e)=>updateOccupation(occupation.id, 'yearsFrom', e.target.value),
                                                                    placeholder: "e.g., 1966",
                                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step3Career.tsx",
                                                                    lineNumber: 124,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step3Career.tsx",
                                                            lineNumber: 122,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs text-charcoal/60 mb-1",
                                                                    children: "To"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step3Career.tsx",
                                                                    lineNumber: 133,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: occupation.yearsTo,
                                                                    onChange: (e)=>updateOccupation(occupation.id, 'yearsTo', e.target.value),
                                                                    placeholder: "e.g., 2006 or 'Present'",
                                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step3Career.tsx",
                                                                    lineNumber: 134,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step3Career.tsx",
                                                            lineNumber: 132,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step3Career.tsx",
                                                    lineNumber: 121,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: occupation.description,
                                                    onChange: (e)=>updateOccupation(occupation.id, 'description', e.target.value),
                                                    placeholder: "Brief description of their role and responsibilities...",
                                                    rows: 3,
                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step3Career.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, occupation.id, true, {
                                            fileName: "[project]/components/wizard/Step3Career.tsx",
                                            lineNumber: 88,
                                            columnNumber: 29
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: addOccupation,
                                        className: "w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                                lineNumber: 158,
                                                columnNumber: 29
                                            }, this),
                                            "Add Another Job"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step3Career.tsx",
                                        lineNumber: 154,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                lineNumber: 86,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step3Career.tsx",
                        lineNumber: 80,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                        size: 18,
                                        className: "text-sage"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step3Career.tsx",
                                        lineNumber: 167,
                                        columnNumber: 25
                                    }, this),
                                    "Career Highlights & Achievements"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                lineNumber: 166,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    data.careerHighlights.map((highlight, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start gap-3 p-4 bg-sage/5 border border-sage/20 rounded-xl group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-2 h-2 rounded-full bg-sage mt-2 flex-shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step3Career.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "flex-1 text-charcoal leading-relaxed",
                                                    children: highlight
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step3Career.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>removeHighlight(index),
                                                    className: "opacity-0 group-hover:opacity-100 p-1 hover:bg-sage/20 rounded transition-all",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        size: 16,
                                                        className: "text-sage"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step3Career.tsx",
                                                        lineNumber: 183,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step3Career.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/components/wizard/Step3Career.tsx",
                                            lineNumber: 173,
                                            columnNumber: 29
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: newHighlight,
                                                onChange: (e)=>setNewHighlight(e.target.value),
                                                onKeyPress: (e)=>e.key === 'Enter' && (e.preventDefault(), addHighlight()),
                                                placeholder: "e.g., Received Teacher of the Year Award...",
                                                className: "flex-1 px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                                lineNumber: 189,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: addHighlight,
                                                className: "px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-xl transition-all flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step3Career.tsx",
                                                        lineNumber: 201,
                                                        columnNumber: 33
                                                    }, this),
                                                    "Add"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                                lineNumber: 197,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step3Career.tsx",
                                        lineNumber: 188,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 bg-terracotta/5 rounded-lg border border-terracotta/20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-charcoal/60",
                                            children: "💡 Examples: Awards, promotions, major projects, publications, recognitions, certifications"
                                        }, void 0, false, {
                                            fileName: "[project]/components/wizard/Step3Career.tsx",
                                            lineNumber: 207,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step3Career.tsx",
                                        lineNumber: 206,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                lineNumber: 171,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step3Career.tsx",
                        lineNumber: 165,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__["GraduationCap"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step3Career.tsx",
                                        lineNumber: 217,
                                        columnNumber: 25
                                    }, this),
                                    "Higher Education Details"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                lineNumber: 216,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 bg-white border border-sand/40 rounded-xl space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs text-charcoal/60 mb-2",
                                                children: "Major / Field of Study"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                                lineNumber: 223,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: data.education.major,
                                                onChange: (e)=>handleEducationChange('major', e.target.value),
                                                placeholder: "e.g., English Literature, Computer Science",
                                                className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                                lineNumber: 224,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step3Career.tsx",
                                        lineNumber: 222,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs text-charcoal/60 mb-2",
                                                children: "Graduation Year"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                                lineNumber: 234,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: data.education.graduationYear,
                                                onChange: (e)=>handleEducationChange('graduationYear', e.target.value),
                                                placeholder: "e.g., 1964",
                                                className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                                lineNumber: 235,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step3Career.tsx",
                                        lineNumber: 233,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs text-charcoal/60 mb-2",
                                                children: "Special Honors or Achievements"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                                lineNumber: 245,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: data.education.honors,
                                                onChange: (e)=>handleEducationChange('honors', e.target.value),
                                                placeholder: "e.g., Summa cum laude, Dean's List, Phi Beta Kappa",
                                                rows: 2,
                                                className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                                lineNumber: 246,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step3Career.tsx",
                                        lineNumber: 244,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                lineNumber: 221,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mt-2",
                                children: "Optional - Fill this in if they pursued higher education"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step3Career.tsx",
                                lineNumber: 256,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step3Career.tsx",
                        lineNumber: 215,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step3Career.tsx",
                lineNumber: 78,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-12 flex gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onBack,
                        className: "px-6 py-4 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all font-medium",
                        children: "← Back"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step3Career.tsx",
                        lineNumber: 264,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onNext,
                        className: "flex-1 bg-terracotta hover:bg-terracotta/90 text-ivory py-4 px-6 rounded-xl font-medium transition-all",
                        children: "Save & Continue →"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step3Career.tsx",
                        lineNumber: 270,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step3Career.tsx",
                lineNumber: 263,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onNext,
                    className: "text-sm text-charcoal/60 hover:text-charcoal transition-colors",
                    children: "I'll fill this in later →"
                }, void 0, false, {
                    fileName: "[project]/components/wizard/Step3Career.tsx",
                    lineNumber: 280,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/wizard/Step3Career.tsx",
                lineNumber: 279,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wizard/Step3Career.tsx",
        lineNumber: 68,
        columnNumber: 9
    }, this);
}
_s(Step3Career, "0i5Zgl6R5EVjSsz29aRqmMQoAYE=");
_c = Step3Career;
var _c;
__turbopack_context__.k.register(_c, "Step3Career");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wizard/Step4Relationships.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Step4Relationships
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
;
var _s = __turbopack_context__.k.signature();
// components/wizard/Step4Relationships.tsx
'use client';
;
;
const EVENT_CATEGORIES = [
    {
        value: 'marriage',
        label: 'Marriage',
        color: 'bg-pink-100 text-pink-700'
    },
    {
        value: 'birth',
        label: 'Birth',
        color: 'bg-blue-100 text-blue-700'
    },
    {
        value: 'career',
        label: 'Career',
        color: 'bg-purple-100 text-purple-700'
    },
    {
        value: 'achievement',
        label: 'Achievement',
        color: 'bg-green-100 text-green-700'
    },
    {
        value: 'loss',
        label: 'Loss',
        color: 'bg-gray-100 text-gray-700'
    },
    {
        value: 'milestone',
        label: 'Milestone',
        color: 'bg-amber-100 text-amber-700'
    }
];
function Step4Relationships({ data, onUpdate, onNext, onBack }) {
    _s();
    const partnerPhotoRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const handleChange = (field, value)=>{
        onUpdate({
            ...data,
            [field]: value
        });
    };
    // Partners Management
    const addPartner = ()=>{
        const newPartner = {
            id: `partner-${Date.now()}`,
            name: '',
            relationshipType: '',
            yearsFrom: '',
            yearsTo: '',
            description: '',
            photo: null,
            photoPreview: null
        };
        handleChange('partners', [
            ...data.partners,
            newPartner
        ]);
    };
    const removePartner = (id)=>{
        handleChange('partners', data.partners.filter((p)=>p.id !== id));
    };
    const updatePartner = (id, field, value)=>{
        handleChange('partners', data.partners.map((p)=>p.id === id ? {
                ...p,
                [field]: value
            } : p));
    };
    const handlePartnerPhotoUpload = (id, e)=>{
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = ()=>{
                updatePartner(id, 'photo', file);
                updatePartner(id, 'photoPreview', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const removePartnerPhoto = (id)=>{
        updatePartner(id, 'photo', null);
        updatePartner(id, 'photoPreview', null);
        if (partnerPhotoRefs.current[id]) {
            partnerPhotoRefs.current[id].value = '';
        }
    };
    // Children Management
    const addChild = ()=>{
        const newChild = {
            id: `child-${Date.now()}`,
            name: '',
            birthYear: '',
            description: ''
        };
        handleChange('children', [
            ...data.children,
            newChild
        ]);
    };
    const removeChild = (id)=>{
        handleChange('children', data.children.filter((c)=>c.id !== id));
    };
    const updateChild = (id, field, value)=>{
        handleChange('children', data.children.map((c)=>c.id === id ? {
                ...c,
                [field]: value
            } : c));
    };
    // Life Events Management
    const addLifeEvent = ()=>{
        const newEvent = {
            id: `event-${Date.now()}`,
            year: '',
            title: '',
            category: 'milestone',
            description: ''
        };
        handleChange('majorLifeEvents', [
            ...data.majorLifeEvents,
            newEvent
        ]);
    };
    const removeLifeEvent = (id)=>{
        handleChange('majorLifeEvents', data.majorLifeEvents.filter((e)=>e.id !== id));
    };
    const updateLifeEvent = (id, field, value)=>{
        handleChange('majorLifeEvents', data.majorLifeEvents.map((e)=>e.id === id ? {
                ...e,
                [field]: value
            } : e));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-3xl mx-auto px-6 py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-serif text-4xl text-charcoal mb-3",
                        children: "Relationships & Family"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                        lineNumber: 125,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-charcoal/60 text-lg",
                        children: "Tell us about the important people in their life and major life events."
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                        lineNumber: 128,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                lineNumber: 124,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                        lineNumber: 137,
                                        columnNumber: 25
                                    }, this),
                                    "Life Partners / Spouses"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                lineNumber: 136,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    data.partners.map((partner)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>removePartner(partner.id),
                                                    className: "absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all",
                                                    title: "Remove",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                    lineNumber: 148,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-shrink-0",
                                                            children: [
                                                                !partner.photoPreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    onClick: ()=>partnerPhotoRefs.current[partner.id]?.click(),
                                                                    className: "w-24 h-24 border-2 border-dashed border-sand/40 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-sage/40 hover:bg-sage/5 transition-all",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                                            size: 20,
                                                                            className: "text-charcoal/40 mb-1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                            lineNumber: 164,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-charcoal/40",
                                                                            children: "Photo"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                            lineNumber: 165,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 160,
                                                                    columnNumber: 45
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "relative w-24 h-24",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                            src: partner.photoPreview,
                                                                            alt: partner.name,
                                                                            className: "w-full h-full object-cover rounded-xl border-2 border-sand/30"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                            lineNumber: 169,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>removePartnerPhoto(partner.id),
                                                                            className: "absolute -top-2 -right-2 p-1 bg-charcoal rounded-full",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                size: 12,
                                                                                className: "text-ivory"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                                lineNumber: 178,
                                                                                columnNumber: 53
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                            lineNumber: 174,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 168,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    ref: (el)=>{
                                                                        partnerPhotoRefs.current[partner.id] = el;
                                                                    },
                                                                    type: "file",
                                                                    accept: "image/*",
                                                                    onChange: (e)=>handlePartnerPhotoUpload(partner.id, e),
                                                                    className: "hidden"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 182,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                            lineNumber: 158,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 space-y-3 pr-8",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: partner.name,
                                                                    onChange: (e)=>updatePartner(partner.id, 'name', e.target.value),
                                                                    placeholder: "Name (e.g., James Thompson)",
                                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all font-medium"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 193,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: partner.relationshipType,
                                                                    onChange: (e)=>updatePartner(partner.id, 'relationshipType', e.target.value),
                                                                    placeholder: "Relationship (e.g., Spouse, Partner, Husband, Wife)",
                                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 201,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                            lineNumber: 192,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                    lineNumber: 156,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs text-charcoal/60 mb-1",
                                                                    children: "Together From"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 213,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: partner.yearsFrom,
                                                                    onChange: (e)=>updatePartner(partner.id, 'yearsFrom', e.target.value),
                                                                    placeholder: "e.g., 1966",
                                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 214,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                            lineNumber: 212,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs text-charcoal/60 mb-1",
                                                                    children: "To"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 223,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: partner.yearsTo,
                                                                    onChange: (e)=>updatePartner(partner.id, 'yearsTo', e.target.value),
                                                                    placeholder: "e.g., 2018 or 'Present'",
                                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 224,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                            lineNumber: 222,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                    lineNumber: 211,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: partner.description,
                                                    onChange: (e)=>updatePartner(partner.id, 'description', e.target.value),
                                                    placeholder: "Brief description of their relationship...",
                                                    rows: 2,
                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, partner.id, true, {
                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                            lineNumber: 143,
                                            columnNumber: 29
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: addPartner,
                                        className: "w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                lineNumber: 248,
                                                columnNumber: 29
                                            }, this),
                                            "Add Partner/Spouse"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                        lineNumber: 244,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                lineNumber: 141,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                        lineNumber: 135,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        size: 18,
                                        className: "text-sage"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                        lineNumber: 257,
                                        columnNumber: 25
                                    }, this),
                                    "Children"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                lineNumber: 256,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    data.children.map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>removeChild(child.id),
                                                    className: "absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all",
                                                    title: "Remove",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                        lineNumber: 273,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "pr-8",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: child.name,
                                                        onChange: (e)=>updateChild(child.id, 'name', e.target.value),
                                                        placeholder: "Name (e.g., Michael James Thompson)",
                                                        className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all font-medium"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                        lineNumber: 277,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs text-charcoal/60 mb-1",
                                                            children: "Birth Year"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                            lineNumber: 287,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: child.birthYear,
                                                            onChange: (e)=>updateChild(child.id, 'birthYear', e.target.value),
                                                            placeholder: "e.g., 1968",
                                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                            lineNumber: 288,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                    lineNumber: 286,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: child.description,
                                                    onChange: (e)=>updateChild(child.id, 'description', e.target.value),
                                                    placeholder: "Brief description (e.g., Civil rights attorney in Atlanta)",
                                                    rows: 2,
                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                    lineNumber: 297,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, child.id, true, {
                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                            lineNumber: 263,
                                            columnNumber: 29
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: addChild,
                                        className: "w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                lineNumber: 311,
                                                columnNumber: 29
                                            }, this),
                                            "Add Child"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                        lineNumber: 307,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                lineNumber: 261,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                        lineNumber: 255,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                        lineNumber: 320,
                                        columnNumber: 25
                                    }, this),
                                    "Major Life Events Timeline"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                lineNumber: 319,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mb-4",
                                children: "Add significant moments and turning points throughout their life"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                lineNumber: 323,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    data.majorLifeEvents.sort((a, b)=>(a.year || '').localeCompare(b.year || '')).map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>removeLifeEvent(event.id),
                                                    className: "absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all",
                                                    title: "Remove",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                        lineNumber: 341,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                    lineNumber: 336,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-4 pr-8",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-24",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs text-charcoal/60 mb-1",
                                                                    children: "Year"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 346,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: event.year,
                                                                    onChange: (e)=>updateLifeEvent(event.id, 'year', e.target.value),
                                                                    placeholder: "1968",
                                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all text-center font-medium"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 347,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                            lineNumber: 345,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs text-charcoal/60 mb-1",
                                                                    children: "Event Title"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 357,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: event.title,
                                                                    onChange: (e)=>updateLifeEvent(event.id, 'title', e.target.value),
                                                                    placeholder: "e.g., Married James Thompson",
                                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all font-medium"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 358,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                            lineNumber: 356,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                    lineNumber: 344,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs text-charcoal/60 mb-2",
                                                            children: "Category"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                            lineNumber: 369,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap gap-2",
                                                            children: EVENT_CATEGORIES.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>updateLifeEvent(event.id, 'category', cat.value),
                                                                    className: `px-4 py-2 rounded-full text-xs font-medium transition-all ${event.category === cat.value ? cat.color : 'bg-sand/20 text-charcoal/60 hover:bg-sand/30'}`,
                                                                    children: cat.label
                                                                }, cat.value, false, {
                                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                                    lineNumber: 372,
                                                                    columnNumber: 49
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                            lineNumber: 370,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                    lineNumber: 368,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: event.description,
                                                    onChange: (e)=>updateLifeEvent(event.id, 'description', e.target.value),
                                                    placeholder: "Brief description of what happened...",
                                                    rows: 2,
                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                    lineNumber: 386,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, event.id, true, {
                                            fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                            lineNumber: 331,
                                            columnNumber: 33
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: addLifeEvent,
                                        className: "w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                                lineNumber: 400,
                                                columnNumber: 29
                                            }, this),
                                            "Add Life Event"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                        lineNumber: 396,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                lineNumber: 327,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 p-3 bg-terracotta/5 rounded-lg border border-terracotta/20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-charcoal/60",
                                    children: "💡 Examples: Marriage, births, graduations, career milestones, moves, awards, losses"
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                    lineNumber: 406,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                                lineNumber: 405,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                        lineNumber: 318,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                lineNumber: 133,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-12 flex gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onBack,
                        className: "px-6 py-4 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all font-medium",
                        children: "← Back"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                        lineNumber: 415,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onNext,
                        className: "flex-1 bg-terracotta hover:bg-terracotta/90 text-ivory py-4 px-6 rounded-xl font-medium transition-all",
                        children: "Save & Continue →"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step4Relationships.tsx",
                        lineNumber: 421,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                lineNumber: 414,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onNext,
                    className: "text-sm text-charcoal/60 hover:text-charcoal transition-colors",
                    children: "I'll fill this in later →"
                }, void 0, false, {
                    fileName: "[project]/components/wizard/Step4Relationships.tsx",
                    lineNumber: 431,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/wizard/Step4Relationships.tsx",
                lineNumber: 430,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wizard/Step4Relationships.tsx",
        lineNumber: 123,
        columnNumber: 9
    }, this);
}
_s(Step4Relationships, "qAiY9YhV8X1pc7siBCuRiBFyBP0=");
_c = Step4Relationships;
var _c;
__turbopack_context__.k.register(_c, "Step4Relationships");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wizard/Step5Personality.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Step5Personality
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/compass.js [app-client] (ecmascript) <export default as Compass>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/quote.js [app-client] (ecmascript) <export default as Quote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
;
var _s = __turbopack_context__.k.signature();
// components/wizard/Step5Personality.tsx
'use client';
;
;
const PERSONALITY_TRAITS = [
    'Passionate',
    'Wise',
    'Compassionate',
    'Determined',
    'Funny',
    'Quiet',
    'Bold',
    'Gentle',
    'Patient',
    'Creative',
    'Adventurous',
    'Thoughtful',
    'Energetic',
    'Calm',
    'Generous',
    'Independent',
    'Loyal',
    'Optimistic',
    'Practical',
    'Spontaneous',
    'Analytical',
    'Empathetic',
    'Resilient',
    'Curious',
    'Disciplined',
    'Humble',
    'Charismatic',
    'Reflective',
    'Nurturing',
    'Ambitious',
    'Inspiring',
    'Graceful',
    'Witty',
    'Sincere',
    'Fearless'
];
const CORE_VALUES = [
    'Family',
    'Education',
    'Justice',
    'Kindness',
    'Faith',
    'Hard work',
    'Creativity',
    'Community',
    'Integrity',
    'Freedom',
    'Compassion',
    'Excellence',
    'Tradition',
    'Innovation',
    'Service',
    'Honesty',
    'Courage',
    'Respect',
    'Growth',
    'Love',
    'Peace',
    'Generosity',
    'Wisdom',
    'Humility',
    'Perseverance'
];
function Step5Personality({ data, onUpdate, onNext, onBack }) {
    _s();
    const [newPassion, setNewPassion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [newSaying, setNewSaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [customValue, setCustomValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleChange = (field, value)=>{
        onUpdate({
            ...data,
            [field]: value
        });
    };
    // Personality Traits
    const toggleTrait = (trait)=>{
        const current = data.personalityTraits;
        if (current.includes(trait)) {
            handleChange('personalityTraits', current.filter((t)=>t !== trait));
        } else {
            handleChange('personalityTraits', [
                ...current,
                trait
            ]);
        }
    };
    // Core Values
    const toggleValue = (value)=>{
        const current = data.coreValues;
        if (current.includes(value)) {
            handleChange('coreValues', current.filter((v)=>v !== value));
        } else {
            handleChange('coreValues', [
                ...current,
                value
            ]);
        }
    };
    const addCustomValue = ()=>{
        if (customValue.trim() && !data.coreValues.includes(customValue.trim())) {
            handleChange('coreValues', [
                ...data.coreValues,
                customValue.trim()
            ]);
            setCustomValue('');
        }
    };
    const removeCustomValue = (value)=>{
        if (!CORE_VALUES.includes(value)) {
            handleChange('coreValues', data.coreValues.filter((v)=>v !== value));
        }
    };
    // Passions
    const addPassion = ()=>{
        if (newPassion.trim() && !data.passions.includes(newPassion.trim())) {
            handleChange('passions', [
                ...data.passions,
                newPassion.trim()
            ]);
            setNewPassion('');
        }
    };
    const removePassion = (passion)=>{
        handleChange('passions', data.passions.filter((p)=>p !== passion));
    };
    // Favorite Quotes
    const addQuote = ()=>{
        const newQuote = {
            id: `quote-${Date.now()}`,
            text: '',
            context: ''
        };
        handleChange('favoriteQuotes', [
            ...data.favoriteQuotes,
            newQuote
        ]);
    };
    const removeQuote = (id)=>{
        handleChange('favoriteQuotes', data.favoriteQuotes.filter((q)=>q.id !== id));
    };
    const updateQuote = (id, field, value)=>{
        handleChange('favoriteQuotes', data.favoriteQuotes.map((q)=>q.id === id ? {
                ...q,
                [field]: value
            } : q));
    };
    // Memorable Sayings
    const addSaying = ()=>{
        if (newSaying.trim() && !data.memorableSayings.includes(newSaying.trim())) {
            handleChange('memorableSayings', [
                ...data.memorableSayings,
                newSaying.trim()
            ]);
            setNewSaying('');
        }
    };
    const removeSaying = (index)=>{
        handleChange('memorableSayings', data.memorableSayings.filter((_, i)=>i !== index));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-4xl mx-auto px-6 py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-serif text-4xl text-charcoal mb-3",
                        children: "Personality, Values & Passions"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                        lineNumber: 123,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-charcoal/60 text-lg",
                        children: "Help us understand who they were at their core."
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                        lineNumber: 126,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step5Personality.tsx",
                lineNumber: 122,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 135,
                                        columnNumber: 25
                                    }, this),
                                    "How would you describe them?"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 134,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mb-4",
                                children: "Select 5-10 traits that capture their essence"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 138,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3",
                                children: PERSONALITY_TRAITS.map((trait)=>{
                                    const isSelected = data.personalityTraits.includes(trait);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleTrait(trait),
                                        className: `px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${isSelected ? 'bg-sage text-ivory border-sage shadow-md' : 'bg-white text-charcoal border-sand/40 hover:border-sage/40 hover:bg-sage/5'}`,
                                        children: trait
                                    }, trait, false, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 144,
                                        columnNumber: 33
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 140,
                                columnNumber: 21
                            }, this),
                            data.personalityTraits.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-sage mt-3",
                                children: [
                                    "✓ Selected ",
                                    data.personalityTraits.length,
                                    " trait",
                                    data.personalityTraits.length !== 1 ? 's' : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 159,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                        lineNumber: 133,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__["Compass"], {
                                        size: 18,
                                        className: "text-sage"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 168,
                                        columnNumber: 25
                                    }, this),
                                    "What mattered most to them?"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 167,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4",
                                children: CORE_VALUES.map((value)=>{
                                    const isSelected = data.coreValues.includes(value);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleValue(value),
                                        className: `px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${isSelected ? 'bg-terracotta text-ivory border-terracotta shadow-md' : 'bg-white text-charcoal border-sand/40 hover:border-terracotta/40 hover:bg-terracotta/5'}`,
                                        children: value
                                    }, value, false, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 176,
                                        columnNumber: 33
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 172,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: data.coreValues.filter((v)=>!CORE_VALUES.includes(v)).map((value, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 text-terracotta border border-terracotta/30 rounded-full mr-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium",
                                                children: value
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 199,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>removeCustomValue(value),
                                                className: "hover:bg-terracotta/20 rounded-full p-1 transition-all",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                    lineNumber: 204,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 200,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 195,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 191,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 mt-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: customValue,
                                        onChange: (e)=>setCustomValue(e.target.value),
                                        onKeyPress: (e)=>e.key === 'Enter' && (e.preventDefault(), addCustomValue()),
                                        placeholder: "Add custom value...",
                                        className: "flex-1 px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 211,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: addCustomValue,
                                        className: "px-6 py-3 bg-terracotta hover:bg-terracotta/90 text-ivory rounded-xl transition-all flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 223,
                                                columnNumber: 29
                                            }, this),
                                            "Add"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 219,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 210,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                        lineNumber: 166,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 232,
                                        columnNumber: 25
                                    }, this),
                                    "What did they love?"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 231,
                                columnNumber: 21
                            }, this),
                            data.passions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2 mb-3",
                                children: data.passions.map((passion, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 px-4 py-2 bg-sage/10 text-sage border border-sage/30 rounded-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium",
                                                children: passion
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 243,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>removePassion(passion),
                                                className: "hover:bg-sage/20 rounded-full p-1 transition-all",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                    lineNumber: 248,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 244,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 239,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 237,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: newPassion,
                                        onChange: (e)=>setNewPassion(e.target.value),
                                        onKeyPress: (e)=>e.key === 'Enter' && (e.preventDefault(), addPassion()),
                                        placeholder: "e.g., Jazz music, gardening, teaching...",
                                        className: "flex-1 px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 256,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: addPassion,
                                        className: "px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-xl transition-all flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 268,
                                                columnNumber: 29
                                            }, this),
                                            "Add"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 264,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 255,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 p-3 bg-terracotta/5 rounded-lg border border-terracotta/20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-charcoal/60",
                                    children: "💡 Examples: Hobbies, sports, arts, music genres, books, cooking, nature, travel, volunteer work"
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step5Personality.tsx",
                                    lineNumber: 274,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 273,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                        lineNumber: 230,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__["Compass"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 283,
                                        columnNumber: 25
                                    }, this),
                                    "Did they have a motto or life philosophy?"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 282,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: data.lifePhilosophy,
                                onChange: (e)=>handleChange('lifePhilosophy', e.target.value),
                                placeholder: "What did they believe about how to live a good life?",
                                rows: 4,
                                className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 286,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 p-3 bg-sage/5 rounded-lg border border-sage/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-medium text-sage mb-2",
                                        children: "Examples:"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 294,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-1 text-xs text-charcoal/60",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: '• "She believed kindness was never wasted"'
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 296,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: '• "He lived by: leave things better than you found them"'
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 297,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: '• "Family first, always"'
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 298,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 295,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 293,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                        lineNumber: 281,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__["Quote"], {
                                        size: 18,
                                        className: "text-sage"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 306,
                                        columnNumber: 25
                                    }, this),
                                    "Favorite Quotes (Optional)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 305,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mb-4",
                                children: "Quotes that were meaningful to them"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 309,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    data.favoriteQuotes.map((quote)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-6 bg-white border border-sand/40 rounded-xl space-y-3 relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>removeQuote(quote.id),
                                                    className: "absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all",
                                                    title: "Remove",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                        lineNumber: 322,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "pr-8",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs text-charcoal/60 mb-1",
                                                            children: "Quote"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                            lineNumber: 326,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            value: quote.text,
                                                            onChange: (e)=>updateQuote(quote.id, 'text', e.target.value),
                                                            placeholder: "The quote itself...",
                                                            rows: 2,
                                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                            lineNumber: 327,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                    lineNumber: 325,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs text-charcoal/60 mb-1",
                                                            children: "Why it mattered (context)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                            lineNumber: 337,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: quote.context,
                                                            onChange: (e)=>updateQuote(quote.id, 'context', e.target.value),
                                                            placeholder: "e.g., She had this framed in her classroom",
                                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                            lineNumber: 338,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                    lineNumber: 336,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, quote.id, true, {
                                            fileName: "[project]/components/wizard/Step5Personality.tsx",
                                            lineNumber: 313,
                                            columnNumber: 29
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: addQuote,
                                        className: "w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 353,
                                                columnNumber: 29
                                            }, this),
                                            "Add Favorite Quote"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 349,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 311,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                        lineNumber: 304,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 362,
                                        columnNumber: 25
                                    }, this),
                                    "Memorable Sayings (Optional)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 361,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mb-4",
                                children: "Things they would always say"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 365,
                                columnNumber: 21
                            }, this),
                            data.memorableSayings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 mb-3",
                                children: data.memorableSayings.map((saying, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3 p-4 bg-terracotta/5 border border-terracotta/20 rounded-xl group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__["Quote"], {
                                                size: 16,
                                                className: "text-terracotta mt-1 flex-shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 374,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "flex-1 text-charcoal italic",
                                                children: [
                                                    '"',
                                                    saying,
                                                    '"'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 375,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>removeSaying(idx),
                                                className: "opacity-0 group-hover:opacity-100 p-1 hover:bg-terracotta/20 rounded transition-all",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    size: 16,
                                                    className: "text-terracotta"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                    lineNumber: 380,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 376,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 370,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 368,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: newSaying,
                                        onChange: (e)=>setNewSaying(e.target.value),
                                        onKeyPress: (e)=>e.key === 'Enter' && (e.preventDefault(), addSaying()),
                                        placeholder: 'e.g., "Measure twice, cut once"',
                                        className: "flex-1 px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 388,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: addSaying,
                                        className: "px-6 py-3 bg-terracotta hover:bg-terracotta/90 text-ivory rounded-xl transition-all flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                                lineNumber: 400,
                                                columnNumber: 29
                                            }, this),
                                            "Add"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                                        lineNumber: 396,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 387,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 p-3 bg-sage/5 rounded-lg border border-sage/20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-charcoal/60",
                                    children: '💡 Examples: "That\'s a blessing in disguise", "Life\'s too short for bad coffee", "When in doubt, dance it out"'
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step5Personality.tsx",
                                    lineNumber: 406,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step5Personality.tsx",
                                lineNumber: 405,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                        lineNumber: 360,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step5Personality.tsx",
                lineNumber: 131,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-12 flex gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onBack,
                        className: "px-6 py-4 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all font-medium",
                        children: "← Back"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                        lineNumber: 415,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onNext,
                        className: "flex-1 bg-terracotta hover:bg-terracotta/90 text-ivory py-4 px-6 rounded-xl font-medium transition-all",
                        children: "Save & Continue →"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step5Personality.tsx",
                        lineNumber: 421,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step5Personality.tsx",
                lineNumber: 414,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onNext,
                    className: "text-sm text-charcoal/60 hover:text-charcoal transition-colors",
                    children: "I'll fill this in later →"
                }, void 0, false, {
                    fileName: "[project]/components/wizard/Step5Personality.tsx",
                    lineNumber: 431,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/wizard/Step5Personality.tsx",
                lineNumber: 430,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wizard/Step5Personality.tsx",
        lineNumber: 121,
        columnNumber: 9
    }, this);
}
_s(Step5Personality, "xSs43lBNB+1UkN3tKAxDZQu76MI=");
_c = Step5Personality;
var _c;
__turbopack_context__.k.register(_c, "Step5Personality");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wizard/Step6LifeStory.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Step6LifeStory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
;
var _s = __turbopack_context__.k.signature();
// components/wizard/Step6LifeStory.tsx
'use client';
;
;
const WRITING_PROMPTS = [
    "What challenges did they overcome?",
    "What made them unique?",
    "How did they treat others?",
    "What brought them joy?",
    "What would people remember most?",
    "What were their proudest moments?",
    "How did they handle adversity?",
    "What wisdom did they share?",
    "What was their impact on others?",
    "What legacy did they leave?"
];
const BIOGRAPHY_TEMPLATE = `[Opening - Who they were in essence]


[Early Life - Childhood, family, education]


[Adult Years - Career, relationships, family they built]


[Middle Years - Achievements, challenges, growth]


[Later Years - Wisdom, legacy, final chapter]


[Closing - What they meant to others]

`;
function Step6LifeStory({ data, onUpdate, onNext, onBack }) {
    _s();
    const [showPrompts, setShowPrompts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showTemplate, setShowTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [previousBiography, setPreviousBiography] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleChange = (field, value)=>{
        onUpdate({
            ...data,
            [field]: value
        });
    };
    const wordCount = data.biography.trim().split(/\s+/).filter((w)=>w.length > 0).length;
    const useTemplate = ()=>{
        if (window.confirm('This will replace your current biography text. Continue?')) {
            // Save current text for undo
            setPreviousBiography(data.biography);
            handleChange('biography', BIOGRAPHY_TEMPLATE);
            setShowTemplate(false);
        }
    };
    const undoTemplate = ()=>{
        if (previousBiography !== null) {
            handleChange('biography', previousBiography);
            setPreviousBiography(null);
        }
    };
    // Life Chapters Management
    const addChapter = ()=>{
        const newChapter = {
            id: `chapter-${Date.now()}`,
            period: '',
            ageRange: '',
            title: '',
            description: '',
            keyEvents: []
        };
        handleChange('lifeChapters', [
            ...data.lifeChapters,
            newChapter
        ]);
    };
    const removeChapter = (id)=>{
        handleChange('lifeChapters', data.lifeChapters.filter((c)=>c.id !== id));
    };
    const updateChapter = (id, field, value)=>{
        handleChange('lifeChapters', data.lifeChapters.map((c)=>c.id === id ? {
                ...c,
                [field]: value
            } : c));
    };
    const addKeyEvent = (chapterId)=>{
        const chapter = data.lifeChapters.find((c)=>c.id === chapterId);
        if (chapter) {
            updateChapter(chapterId, 'keyEvents', [
                ...chapter.keyEvents,
                ''
            ]);
        }
    };
    const updateKeyEvent = (chapterId, eventIndex, value)=>{
        const chapter = data.lifeChapters.find((c)=>c.id === chapterId);
        if (chapter) {
            const newEvents = [
                ...chapter.keyEvents
            ];
            newEvents[eventIndex] = value;
            updateChapter(chapterId, 'keyEvents', newEvents);
        }
    };
    const removeKeyEvent = (chapterId, eventIndex)=>{
        const chapter = data.lifeChapters.find((c)=>c.id === chapterId);
        if (chapter) {
            updateChapter(chapterId, 'keyEvents', chapter.keyEvents.filter((_, i)=>i !== eventIndex));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-6xl mx-auto px-6 py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-serif text-4xl text-charcoal mb-3",
                        children: "Full Life Story"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                        lineNumber: 128,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-charcoal/60 text-lg",
                        children: "This is the heart of the memorial. Take your time - you can save and come back anytime."
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                        lineNumber: 131,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                lineNumber: 127,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center gap-2 text-sm font-medium text-charcoal",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                        size: 18,
                                                        className: "text-terracotta"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 33
                                                    }, this),
                                                    "Biography"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                lineNumber: 141,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    previousBiography !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: undoTemplate,
                                                        className: "text-xs px-3 py-2 bg-terracotta/10 text-terracotta border border-terracotta/30 rounded-lg hover:bg-terracotta/20 transition-all flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                lineNumber: 151,
                                                                columnNumber: 41
                                                            }, this),
                                                            "Undo Template"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                        lineNumber: 147,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowTemplate(!showTemplate),
                                                        className: "text-xs px-3 py-2 border border-sand/40 rounded-lg hover:bg-sand/10 transition-all flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                lineNumber: 159,
                                                                columnNumber: 37
                                                            }, this),
                                                            showTemplate ? 'Hide' : 'Show',
                                                            " Template"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                lineNumber: 145,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                        lineNumber: 140,
                                        columnNumber: 25
                                    }, this),
                                    showTemplate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 p-4 bg-terracotta/5 border border-terracotta/20 rounded-xl",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                size: 16,
                                                                className: "text-terracotta"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                lineNumber: 169,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-medium text-charcoal",
                                                                children: "Suggested Structure"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                lineNumber: 170,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                        lineNumber: 168,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: useTemplate,
                                                        className: "text-xs px-3 py-1.5 bg-terracotta hover:bg-terracotta/90 text-ivory rounded-lg transition-all",
                                                        children: "Use This Template"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                        lineNumber: 172,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                lineNumber: 167,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-charcoal/60",
                                                children: "This template provides a helpful structure for writing a complete life story."
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                lineNumber: 179,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                        lineNumber: 166,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: data.biography,
                                        onChange: (e)=>handleChange('biography', e.target.value),
                                        placeholder: "Tell their complete story here...      Start with who they were in essence, then guide us through their journey from early life through their final years. What made them special? What did they overcome? How did they touch lives?      Don't worry about making it perfect - just write from the heart. You can always edit later.",
                                        rows: 20,
                                        className: "w-full px-6 py-4 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none font-serif text-base leading-relaxed"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                        lineNumber: 185,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between text-xs text-charcoal/60",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: wordCount >= 500 ? 'text-sage font-medium' : '',
                                                        children: [
                                                            wordCount,
                                                            " words ",
                                                            wordCount < 500 && `(${500 - wordCount} more recommended)`
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                        lineNumber: 199,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-charcoal/40",
                                                        children: "•"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                        lineNumber: 202,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-charcoal/40",
                                                        children: "Auto-saving..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                        lineNumber: 203,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                lineNumber: 198,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: onNext,
                                                className: "text-sage hover:text-sage/80 transition-colors",
                                                children: "I'll continue this later →"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                lineNumber: 205,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                        lineNumber: 197,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                lineNumber: 139,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pt-8 border-t border-sand/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                            size: 18,
                                                            className: "text-sage"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 219,
                                                            columnNumber: 37
                                                        }, this),
                                                        "Life Chapters (Optional but Recommended)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-charcoal/40",
                                                    children: "Break their life into 4-6 chapters to help organize the story"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                    lineNumber: 222,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                            lineNumber: 217,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                        lineNumber: 216,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-6",
                                        children: [
                                            data.lifeChapters.map((chapter, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute -top-3 -left-3 w-10 h-10 bg-sage text-ivory rounded-full flex items-center justify-center font-serif text-lg font-bold shadow-md",
                                                            children: index + 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 235,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>removeChapter(chapter.id),
                                                            className: "absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all",
                                                            title: "Remove chapter",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                size: 18
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                lineNumber: 245,
                                                                columnNumber: 41
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 240,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-2 gap-4 pt-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-xs text-charcoal/60 mb-1",
                                                                            children: "Period"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                            lineNumber: 250,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "text",
                                                                            value: chapter.period,
                                                                            onChange: (e)=>updateChapter(chapter.id, 'period', e.target.value),
                                                                            placeholder: "e.g., 1960-1975",
                                                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                            lineNumber: 251,
                                                                            columnNumber: 45
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                    lineNumber: 249,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-xs text-charcoal/60 mb-1",
                                                                            children: "Age Range"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                            lineNumber: 260,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "text",
                                                                            value: chapter.ageRange,
                                                                            onChange: (e)=>updateChapter(chapter.id, 'ageRange', e.target.value),
                                                                            placeholder: "e.g., Ages 18-33",
                                                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                            lineNumber: 261,
                                                                            columnNumber: 45
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 248,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs text-charcoal/60 mb-1",
                                                                    children: "Chapter Title"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                    lineNumber: 272,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: chapter.title,
                                                                    onChange: (e)=>updateChapter(chapter.id, 'title', e.target.value),
                                                                    placeholder: "e.g., Finding My Path",
                                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all font-medium"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                    lineNumber: 273,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 271,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs text-charcoal/60 mb-1",
                                                                    children: "Description"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                    lineNumber: 283,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                    value: chapter.description,
                                                                    onChange: (e)=>updateChapter(chapter.id, 'description', e.target.value),
                                                                    placeholder: "Describe this period of their life (3-5 lines)...",
                                                                    rows: 4,
                                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                    lineNumber: 284,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 282,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs text-charcoal/60 mb-2",
                                                                    children: "Key Events in this Chapter"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                    lineNumber: 295,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-2",
                                                                    children: [
                                                                        chapter.keyEvents.map((event, eventIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "w-2 h-2 rounded-full bg-sage mt-3 flex-shrink-0"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                                        lineNumber: 299,
                                                                                        columnNumber: 53
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        type: "text",
                                                                                        value: event,
                                                                                        onChange: (e)=>updateKeyEvent(chapter.id, eventIdx, e.target.value),
                                                                                        placeholder: "Describe a key event...",
                                                                                        className: "flex-1 px-4 py-2 border border-sand/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all text-sm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                                        lineNumber: 300,
                                                                                        columnNumber: 53
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>removeKeyEvent(chapter.id, eventIdx),
                                                                                        className: "p-2 hover:bg-sand/20 rounded-lg transition-all",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                            size: 16,
                                                                                            className: "text-charcoal/40"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                                            lineNumber: 311,
                                                                                            columnNumber: 57
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                                        lineNumber: 307,
                                                                                        columnNumber: 53
                                                                                    }, this)
                                                                                ]
                                                                            }, eventIdx, true, {
                                                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                                lineNumber: 298,
                                                                                columnNumber: 49
                                                                            }, this)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>addKeyEvent(chapter.id),
                                                                            className: "text-xs text-sage hover:text-sage/80 transition-colors flex items-center gap-1 ml-4",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                                    size: 14
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                                    lineNumber: 319,
                                                                                    columnNumber: 49
                                                                                }, this),
                                                                                "Add Key Event"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                            lineNumber: 315,
                                                                            columnNumber: 45
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                                    lineNumber: 296,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 294,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, chapter.id, true, {
                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 33
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: addChapter,
                                                className: "w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                        lineNumber: 331,
                                                        columnNumber: 33
                                                    }, this),
                                                    "Add Life Chapter"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                lineNumber: 327,
                                                columnNumber: 29
                                            }, this),
                                            data.lifeChapters.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 bg-sage/5 rounded-lg border border-sage/20",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-charcoal/60",
                                                    children: "💡 Tip: Most life stories work well with 4-6 chapters covering different periods"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                    lineNumber: 337,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                lineNumber: 336,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                        lineNumber: 228,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                lineNumber: 215,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                        lineNumber: 138,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sticky top-24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gradient-to-br from-terracotta/5 to-sage/5 rounded-xl p-6 border border-sand/30",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                                            size: 18,
                                                            className: "text-terracotta"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 352,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-sm font-medium text-charcoal",
                                                            children: "Writing Prompts"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 353,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                    lineNumber: 351,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowPrompts(!showPrompts),
                                                    className: "text-xs text-charcoal/60 hover:text-charcoal transition-colors",
                                                    children: showPrompts ? 'Hide' : 'Show'
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                    lineNumber: 355,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                            lineNumber: 350,
                                            columnNumber: 29
                                        }, this),
                                        showPrompts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: WRITING_PROMPTS.map((prompt, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-3 bg-white/50 rounded-lg border border-sand/20 hover:border-sage/30 hover:bg-white transition-all cursor-pointer",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-charcoal/70 leading-relaxed",
                                                        children: prompt
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                        lineNumber: 370,
                                                        columnNumber: 45
                                                    }, this)
                                                }, idx, false, {
                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                    lineNumber: 366,
                                                    columnNumber: 41
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                            lineNumber: 364,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-6 pt-6 border-t border-sand/20",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-2 text-xs text-charcoal/60",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                                        size: 14,
                                                        className: "flex-shrink-0 mt-0.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                        lineNumber: 378,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Click these prompts for inspiration. Don't feel pressure to answer all of them - just use what helps."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                        lineNumber: 379,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                lineNumber: 377,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                            lineNumber: 376,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                    lineNumber: 349,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 p-4 bg-white rounded-xl border border-sand/30",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "text-xs font-medium text-charcoal mb-3",
                                            children: "Quick Tips"
                                        }, void 0, false, {
                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                            lineNumber: 388,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-2 text-xs text-charcoal/60",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sage",
                                                            children: "✓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 391,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Write like you're talking to a friend"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 392,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                    lineNumber: 390,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sage",
                                                            children: "✓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 395,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Include specific memories and details"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 396,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sage",
                                                            children: "✓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 399,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Share their unique qualities and quirks"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 400,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                    lineNumber: 398,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sage",
                                                            children: "✓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 403,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Don't worry about perfect grammar"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 404,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sage",
                                                            children: "✓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 407,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Take breaks if you need to"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                            lineNumber: 408,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                                    lineNumber: 406,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                            lineNumber: 389,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                                    lineNumber: 387,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                            lineNumber: 348,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                        lineNumber: 347,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                lineNumber: 136,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-12 flex gap-4 max-w-6xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onBack,
                        className: "px-6 py-4 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all font-medium",
                        children: "← Back"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                        lineNumber: 418,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onNext,
                        className: "flex-1 bg-terracotta hover:bg-terracotta/90 text-ivory py-4 px-6 rounded-xl font-medium transition-all",
                        children: "Save & Continue →"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                        lineNumber: 424,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step6LifeStory.tsx",
                lineNumber: 417,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wizard/Step6LifeStory.tsx",
        lineNumber: 126,
        columnNumber: 9
    }, this);
}
_s(Step6LifeStory, "akfMD00wA8hg3+DvCfnorY0VkZg=");
_c = Step6LifeStory;
var _c;
__turbopack_context__.k.register(_c, "Step6LifeStory");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wizard/Step7Memories.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Step7Memories
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
;
var _s = __turbopack_context__.k.signature();
// components/wizard/Step7Memories.tsx
'use client';
;
;
function Step7Memories({ data, onUpdate, onNext, onBack }) {
    _s();
    const [newEmail, setNewEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleChange = (field, value)=>{
        onUpdate({
            ...data,
            [field]: value
        });
    };
    // Shared Memories Management
    const addMemory = ()=>{
        const newMemory = {
            id: `memory-${Date.now()}`,
            title: '',
            date: '',
            content: '',
            author: '',
            relationship: ''
        };
        handleChange('sharedMemories', [
            ...data.sharedMemories,
            newMemory
        ]);
    };
    const removeMemory = (id)=>{
        handleChange('sharedMemories', data.sharedMemories.filter((m)=>m.id !== id));
    };
    const updateMemory = (id, field, value)=>{
        handleChange('sharedMemories', data.sharedMemories.map((m)=>m.id === id ? {
                ...m,
                [field]: value
            } : m));
    };
    // Impact Stories Management
    const addImpactStory = ()=>{
        const newStory = {
            id: `impact-${Date.now()}`,
            title: '',
            content: '',
            author: ''
        };
        handleChange('impactStories', [
            ...data.impactStories,
            newStory
        ]);
    };
    const removeImpactStory = (id)=>{
        handleChange('impactStories', data.impactStories.filter((s)=>s.id !== id));
    };
    const updateImpactStory = (id, field, value)=>{
        handleChange('impactStories', data.impactStories.map((s)=>s.id === id ? {
                ...s,
                [field]: value
            } : s));
    };
    // Email Invitations Management
    const addEmail = ()=>{
        const email = newEmail.trim();
        if (email && !data.invitedEmails.includes(email)) {
            // Basic email validation
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                handleChange('invitedEmails', [
                    ...data.invitedEmails,
                    email
                ]);
                setNewEmail('');
            } else {
                alert('Please enter a valid email address');
            }
        }
    };
    const removeEmail = (email)=>{
        handleChange('invitedEmails', data.invitedEmails.filter((e)=>e !== email));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-4xl mx-auto px-6 py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-serif text-4xl text-charcoal mb-3",
                        children: "Memories & Stories from Others"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                        lineNumber: 89,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-charcoal/60 text-lg",
                        children: "Add memories from people who knew them, or invite others to contribute their stories."
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                        lineNumber: 92,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step7Memories.tsx",
                lineNumber: 88,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                        lineNumber: 101,
                                        columnNumber: 25
                                    }, this),
                                    "Shared Memories"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                lineNumber: 100,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mb-4",
                                children: "Add memories and stories from family members and friends"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                lineNumber: 104,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    data.sharedMemories.map((memory)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>removeMemory(memory.id),
                                                    className: "absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all",
                                                    title: "Remove memory",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                    lineNumber: 115,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "pr-8",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs text-charcoal/60 mb-1",
                                                            children: "Memory Title"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 124,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: memory.title,
                                                            onChange: (e)=>updateMemory(memory.id, 'title', e.target.value),
                                                            placeholder: "e.g., The Day She Changed My Life",
                                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all font-medium"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 125,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                    lineNumber: 123,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs text-charcoal/60 mb-1",
                                                            children: "Date (Optional)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 135,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                    className: "absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40",
                                                                    size: 18
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                                    lineNumber: 137,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "date",
                                                                    value: memory.date,
                                                                    onChange: (e)=>updateMemory(memory.id, 'date', e.target.value),
                                                                    className: "w-full pl-12 pr-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                                    lineNumber: 138,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 136,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                    lineNumber: 134,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs text-charcoal/60 mb-1",
                                                            children: "The Memory"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 148,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            value: memory.content,
                                                            onChange: (e)=>updateMemory(memory.id, 'content', e.target.value),
                                                            placeholder: "Share the memory or story...",
                                                            rows: 6,
                                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 149,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                    lineNumber: 147,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs text-charcoal/60 mb-1",
                                                                    children: "Author Name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                                    lineNumber: 160,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: memory.author,
                                                                    onChange: (e)=>updateMemory(memory.id, 'author', e.target.value),
                                                                    placeholder: "e.g., Marcus Johnson",
                                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                                    lineNumber: 161,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 159,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs text-charcoal/60 mb-1",
                                                                    children: "Relationship"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                                    lineNumber: 170,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: memory.relationship,
                                                                    onChange: (e)=>updateMemory(memory.id, 'relationship', e.target.value),
                                                                    placeholder: "e.g., Former Student",
                                                                    className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                                    lineNumber: 171,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 169,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, memory.id, true, {
                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                            lineNumber: 110,
                                            columnNumber: 29
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: addMemory,
                                        className: "w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                lineNumber: 187,
                                                columnNumber: 29
                                            }, this),
                                            "Add Shared Memory"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                        lineNumber: 183,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                lineNumber: 108,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                        lineNumber: 99,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                        size: 18,
                                        className: "text-sage"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                        lineNumber: 196,
                                        columnNumber: 25
                                    }, this),
                                    "Impact Stories"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                lineNumber: 195,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mb-4",
                                children: "How did they change lives? Stories of their lasting impact"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                lineNumber: 199,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    data.impactStories.map((story)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>removeImpactStory(story.id),
                                                    className: "absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all",
                                                    title: "Remove story",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                        lineNumber: 215,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "pr-8",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs text-charcoal/60 mb-1",
                                                            children: "Story Title"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 219,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: story.title,
                                                            onChange: (e)=>updateImpactStory(story.id, 'title', e.target.value),
                                                            placeholder: "e.g., The Teacher Who Saved My Life",
                                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all font-medium"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 220,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs text-charcoal/60 mb-1",
                                                            children: "The Story"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 230,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            value: story.content,
                                                            onChange: (e)=>updateImpactStory(story.id, 'content', e.target.value),
                                                            placeholder: "Tell the story of how they made a difference...",
                                                            rows: 6,
                                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 231,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs text-charcoal/60 mb-1",
                                                            children: "Author & Relationship"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 241,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: story.author,
                                                            onChange: (e)=>updateImpactStory(story.id, 'author', e.target.value),
                                                            placeholder: "e.g., David Chen, Former Student (Class of 2003)",
                                                            className: "w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 242,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                    lineNumber: 240,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, story.id, true, {
                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                            lineNumber: 205,
                                            columnNumber: 29
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: addImpactStory,
                                        className: "w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                lineNumber: 257,
                                                columnNumber: 29
                                            }, this),
                                            "Add Impact Story"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                        lineNumber: 253,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                lineNumber: 203,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 p-3 bg-terracotta/5 rounded-lg border border-terracotta/20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-charcoal/60",
                                    children: '💡 Examples: "She inspired me to become a teacher", "He helped me through the hardest time", "They believed in me when no one else did"'
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                    lineNumber: 263,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                lineNumber: 262,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                        lineNumber: 194,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                        lineNumber: 272,
                                        columnNumber: 25
                                    }, this),
                                    "Invite Others to Contribute"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                lineNumber: 271,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mb-4",
                                children: "Want family or friends to add their memories? Invite them by email (Coming soon - for now, you can add their memories yourself above)"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                lineNumber: 275,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 bg-gradient-to-br from-sage/5 to-terracotta/5 border border-sand/30 rounded-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                size: 18,
                                                className: "text-sage"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                lineNumber: 281,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-charcoal",
                                                children: "Email Invitations"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                lineNumber: 282,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                        lineNumber: 280,
                                        columnNumber: 25
                                    }, this),
                                    data.invitedEmails.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 space-y-2",
                                        children: data.invitedEmails.map((email, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between p-3 bg-white rounded-lg border border-sand/30",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                                size: 16,
                                                                className: "text-sage"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                                lineNumber: 293,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-charcoal",
                                                                children: email
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                                lineNumber: 294,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                        lineNumber: 292,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>removeEmail(email),
                                                        className: "p-1 hover:bg-sand/20 rounded transition-all",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            size: 16,
                                                            className: "text-charcoal/40"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                            lineNumber: 300,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                        lineNumber: 296,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                lineNumber: 288,
                                                columnNumber: 37
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                        lineNumber: 286,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "email",
                                                value: newEmail,
                                                onChange: (e)=>setNewEmail(e.target.value),
                                                onKeyPress: (e)=>e.key === 'Enter' && (e.preventDefault(), addEmail()),
                                                placeholder: "friend@example.com",
                                                className: "flex-1 px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                lineNumber: 308,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: addEmail,
                                                className: "px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-xl transition-all flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                        lineNumber: 320,
                                                        columnNumber: 33
                                                    }, this),
                                                    "Add"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                lineNumber: 316,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                        lineNumber: 307,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 p-3 bg-white/50 rounded-lg border border-sage/20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-charcoal/60 leading-relaxed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Note:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                                                    lineNumber: 327,
                                                    columnNumber: 33
                                                }, this),
                                                " Email invitations will be available soon. For now, save email addresses here and you can invite them later, or add their memories yourself in the sections above."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/wizard/Step7Memories.tsx",
                                            lineNumber: 326,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                                        lineNumber: 325,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step7Memories.tsx",
                                lineNumber: 279,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                        lineNumber: 270,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step7Memories.tsx",
                lineNumber: 97,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-12 flex gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onBack,
                        className: "px-6 py-4 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all font-medium",
                        children: "← Back"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                        lineNumber: 336,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onNext,
                        className: "flex-1 bg-terracotta hover:bg-terracotta/90 text-ivory py-4 px-6 rounded-xl font-medium transition-all",
                        children: "Save & Continue →"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step7Memories.tsx",
                        lineNumber: 342,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step7Memories.tsx",
                lineNumber: 335,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onNext,
                    className: "text-sm text-charcoal/60 hover:text-charcoal transition-colors",
                    children: "I'll fill this in later →"
                }, void 0, false, {
                    fileName: "[project]/components/wizard/Step7Memories.tsx",
                    lineNumber: 352,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/wizard/Step7Memories.tsx",
                lineNumber: 351,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wizard/Step7Memories.tsx",
        lineNumber: 87,
        columnNumber: 9
    }, this);
}
_s(Step7Memories, "OvRft/08ZK4ioJ8OLbbAVuJaPoo=");
_c = Step7Memories;
var _c;
__turbopack_context__.k.register(_c, "Step7Memories");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wizard/Step8Media.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Step8Media
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mic.js [app-client] (ecmascript) <export default as Mic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mouse$2d$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MousePointer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mouse-pointer.js [app-client] (ecmascript) <export default as MousePointer>");
;
var _s = __turbopack_context__.k.signature();
// components/wizard/Step8Media.tsx - UPDATED (No Videos - they're in Step 9 now)
'use client';
;
;
function Step8Media({ data, onUpdate, onNext, onBack }) {
    _s();
    const coverPhotoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const galleryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const interactiveGalleryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const voiceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [hoveredImageId, setHoveredImageId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mousePosition, setMousePosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const handleChange = (field, value)=>{
        onUpdate({
            ...data,
            [field]: value
        });
    };
    // Cover Photo
    const handleCoverPhotoUpload = (e)=>{
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = ()=>{
                handleChange('coverPhoto', file);
                handleChange('coverPhotoPreview', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const removeCoverPhoto = ()=>{
        handleChange('coverPhoto', null);
        handleChange('coverPhotoPreview', null);
        if (coverPhotoRef.current) coverPhotoRef.current.value = '';
    };
    // Gallery
    const handleGalleryUpload = (e)=>{
        const files = Array.from(e.target.files || []);
        const newPhotos = [];
        let processed = 0;
        files.forEach((file)=>{
            const reader = new FileReader();
            reader.onloadend = ()=>{
                newPhotos.push({
                    id: `photo-${Date.now()}-${Math.random()}`,
                    file,
                    preview: reader.result,
                    caption: '',
                    year: '',
                    type: 'photo'
                });
                processed++;
                if (processed === files.length) {
                    handleChange('gallery', [
                        ...data.gallery,
                        ...newPhotos
                    ]);
                }
            };
            reader.readAsDataURL(file);
        });
    };
    const removeGalleryItem = (id)=>{
        handleChange('gallery', data.gallery.filter((item)=>item.id !== id));
    };
    const updateGalleryItem = (id, field, value)=>{
        handleChange('gallery', data.gallery.map((item)=>item.id === id ? {
                ...item,
                [field]: value
            } : item));
    };
    // Interactive Gallery
    const handleInteractiveGalleryUpload = (e)=>{
        const files = Array.from(e.target.files || []);
        const newPhotos = [];
        let processed = 0;
        files.forEach((file)=>{
            const reader = new FileReader();
            reader.onloadend = ()=>{
                newPhotos.push({
                    id: `interactive-${Date.now()}-${Math.random()}`,
                    file,
                    preview: reader.result,
                    description: ''
                });
                processed++;
                if (processed === files.length) {
                    handleChange('interactiveGallery', [
                        ...data.interactiveGallery || [],
                        ...newPhotos
                    ]);
                }
            };
            reader.readAsDataURL(file);
        });
    };
    const removeInteractiveItem = (id)=>{
        handleChange('interactiveGallery', (data.interactiveGallery || []).filter((item)=>item.id !== id));
    };
    const updateInteractiveDescription = (id, description)=>{
        handleChange('interactiveGallery', (data.interactiveGallery || []).map((item)=>item.id === id ? {
                ...item,
                description
            } : item));
    };
    const handleMouseMove = (e, imageId)=>{
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setHoveredImageId(imageId);
    };
    const handleMouseLeave = ()=>{
        setHoveredImageId(null);
    };
    // Voice Recordings
    const handleVoiceUpload = (e)=>{
        const files = Array.from(e.target.files || []);
        files.forEach((file)=>{
            const newRecording = {
                id: `voice-${Date.now()}-${Math.random()}`,
                file,
                title: file.name
            };
            handleChange('voiceRecordings', [
                ...data.voiceRecordings,
                newRecording
            ]);
        });
    };
    const removeVoiceRecording = (id)=>{
        handleChange('voiceRecordings', data.voiceRecordings.filter((v)=>v.id !== id));
    };
    const updateVoiceTitle = (id, title)=>{
        handleChange('voiceRecordings', data.voiceRecordings.map((v)=>v.id === id ? {
                ...v,
                title
            } : v));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-4xl mx-auto px-6 py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-serif text-4xl text-charcoal mb-3",
                        children: "Photos & Legacy"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step8Media.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-charcoal/60 text-lg",
                        children: "Add photos, voice recordings, and your final legacy statement. Videos will be added in the next step."
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step8Media.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step8Media.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 170,
                                        columnNumber: 13
                                    }, this),
                                    "Cover Photo"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mb-4",
                                children: "This will be the hero background image on the memorial page"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            !data.coverPhotoPreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>coverPhotoRef.current?.click(),
                                className: "relative h-64 border-2 border-dashed border-sand/40 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-sage/40 hover:bg-sage/5 transition-all overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                        className: "mb-3 text-charcoal/40",
                                        size: 32
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 181,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-charcoal/60 mb-1",
                                        children: "Click to upload cover photo"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-charcoal/40",
                                        children: "Recommended: Wide landscape photo (1920x1080)"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 183,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 177,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative h-64 rounded-xl overflow-hidden border-2 border-sand/30 group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: data.coverPhotoPreview,
                                        alt: "Cover",
                                        className: "w-full h-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 187,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-all flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: removeCoverPhoto,
                                            className: "opacity-0 group-hover:opacity-100 px-4 py-2 bg-terracotta hover:bg-terracotta/90 text-ivory rounded-lg transition-all flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step8Media.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 19
                                                }, this),
                                                "Remove Cover Photo"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/wizard/Step8Media.tsx",
                                            lineNumber: 193,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 192,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 186,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: coverPhotoRef,
                                type: "file",
                                accept: "image/*",
                                onChange: handleCoverPhotoUpload,
                                className: "hidden"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step8Media.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                        size: 18,
                                        className: "text-sage"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 215,
                                        columnNumber: 13
                                    }, this),
                                    "Photo Gallery"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 214,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mb-4",
                                children: "Upload photos from throughout their life"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 218,
                                columnNumber: 11
                            }, this),
                            data.gallery.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 md:grid-cols-3 gap-4 mb-4",
                                        children: data.gallery.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "aspect-square rounded-xl overflow-hidden bg-sand/20 border border-sand/30",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: item.preview,
                                                            alt: item.caption,
                                                            className: "w-full h-full object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step8Media.tsx",
                                                            lineNumber: 227,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                                        lineNumber: 226,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>removeGalleryItem(item.id),
                                                        className: "absolute top-2 right-2 p-2 bg-charcoal/80 hover:bg-charcoal rounded-full transition-all opacity-0 group-hover:opacity-100",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            size: 14,
                                                            className: "text-ivory"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step8Media.tsx",
                                                            lineNumber: 237,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                                        lineNumber: 233,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 space-y-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: item.caption,
                                                                onChange: (e)=>updateGalleryItem(item.id, 'caption', e.target.value),
                                                                placeholder: "Caption (optional)",
                                                                className: "w-full px-2 py-1 text-xs border border-sand/40 rounded focus:outline-none focus:ring-1 focus:ring-sage/30"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                                lineNumber: 240,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: item.year,
                                                                onChange: (e)=>updateGalleryItem(item.id, 'year', e.target.value),
                                                                placeholder: "Year (optional)",
                                                                className: "w-full px-2 py-1 text-xs border border-sand/40 rounded focus:outline-none focus:ring-1 focus:ring-sage/30"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                                lineNumber: 247,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                                        lineNumber: 239,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, item.id, true, {
                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                lineNumber: 225,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 223,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>galleryRef.current?.click(),
                                        className: "w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                lineNumber: 262,
                                                columnNumber: 17
                                            }, this),
                                            "Add More Photos"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 258,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>galleryRef.current?.click(),
                                className: "border-2 border-dashed border-sand/40 rounded-xl p-8 text-center cursor-pointer hover:border-sage/40 hover:bg-sage/5 transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                        className: "mx-auto mb-3 text-charcoal/40",
                                        size: 32
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 271,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-charcoal/60 mb-1",
                                        children: "Click to upload photos"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 272,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-charcoal/40",
                                        children: "You can select multiple photos"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 273,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 267,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: galleryRef,
                                type: "file",
                                accept: "image/*",
                                multiple: true,
                                onChange: handleGalleryUpload,
                                className: "hidden"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 276,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step8Media.tsx",
                        lineNumber: 213,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mouse$2d$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MousePointer$3e$__["MousePointer"], {
                                        size: 18,
                                        className: "text-sage"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 289,
                                        columnNumber: 13
                                    }, this),
                                    "Interactive Photo Stories (Optional)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 288,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mb-4",
                                children: "Special photos where moving your cursor reveals the hidden story underneath - like a magic spotlight! ✨"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 292,
                                columnNumber: 11
                            }, this),
                            data.interactiveGallery && data.interactiveGallery.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-4",
                                        children: data.interactiveGallery.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative aspect-video rounded-xl overflow-hidden border-2 border-sand/30 group",
                                                        onMouseMove: (e)=>handleMouseMove(e, item.id),
                                                        onMouseLeave: handleMouseLeave,
                                                        style: {
                                                            cursor: 'none'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute inset-0 flex items-center justify-center p-8",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bg-gradient-to-br from-sage/20 via-ivory/90 to-terracotta/20 rounded-2xl p-6 shadow-lg backdrop-blur-sm",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xl md:text-2xl font-serif text-charcoal leading-relaxed text-center font-medium drop-shadow-sm",
                                                                        children: item.description || 'Add your story below and hover to see the magic! ✨'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                                                        lineNumber: 308,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step8Media.tsx",
                                                                    lineNumber: 307,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                                lineNumber: 306,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute inset-0 transition-opacity duration-300",
                                                                style: {
                                                                    maskImage: hoveredImageId === item.id ? `radial-gradient(circle 110px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, black 100%)` : 'none',
                                                                    WebkitMaskImage: hoveredImageId === item.id ? `radial-gradient(circle 110px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, black 100%)` : 'none'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: item.preview,
                                                                    alt: "Interactive photo",
                                                                    className: "w-full h-full object-cover",
                                                                    draggable: false
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step8Media.tsx",
                                                                    lineNumber: 324,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                                lineNumber: 313,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>removeInteractiveItem(item.id),
                                                                className: "absolute top-3 right-3 p-2.5 bg-charcoal/90 hover:bg-charcoal rounded-full transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg",
                                                                style: {
                                                                    cursor: 'pointer'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                    size: 16,
                                                                    className: "text-ivory"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/Step8Media.tsx",
                                                                    lineNumber: 336,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                                lineNumber: 331,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                                        lineNumber: 300,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-medium text-charcoal/80 mb-2",
                                                                children: "📝 Hidden Story (revealed by cursor movement)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                                lineNumber: 340,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                value: item.description,
                                                                onChange: (e)=>updateInteractiveDescription(item.id, e.target.value),
                                                                placeholder: "Example: 'This was the day she taught me how to bake her famous apple pie. I can still remember the smell of cinnamon filling the kitchen...'",
                                                                rows: 4,
                                                                className: "w-full px-4 py-3 text-sm border-2 border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all resize-none font-serif"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                                lineNumber: 343,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-charcoal/40 mt-1",
                                                                children: "💡 Tip: Write 2-3 sentences that tell a meaningful story about this moment"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                                lineNumber: 350,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                                        lineNumber: 339,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, item.id, true, {
                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                lineNumber: 299,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 297,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>interactiveGalleryRef.current?.click(),
                                        className: "w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                lineNumber: 361,
                                                columnNumber: 17
                                            }, this),
                                            "Add More Interactive Photos"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 357,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>interactiveGalleryRef.current?.click(),
                                className: "border-2 border-dashed border-sand/40 rounded-xl p-12 text-center cursor-pointer hover:border-sage/40 hover:bg-sage/5 transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 relative inline-block",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mouse$2d$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MousePointer$3e$__["MousePointer"], {
                                                className: "text-charcoal/40 animate-pulse",
                                                size: 48
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                lineNumber: 371,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute -top-2 -right-2 w-6 h-6 bg-terracotta rounded-full flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-ivory text-xs font-bold",
                                                    children: "✨"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step8Media.tsx",
                                                    lineNumber: 373,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                lineNumber: 372,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 370,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-base font-medium text-charcoal/70 mb-2",
                                        children: "Create Interactive Photo Stories"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 376,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-charcoal/50 max-w-md mx-auto",
                                        children: "Upload photos where visitors can move their cursor to reveal hidden stories - a magical way to share memories!"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 377,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 366,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: interactiveGalleryRef,
                                type: "file",
                                accept: "image/*",
                                multiple: true,
                                onChange: handleInteractiveGalleryUpload,
                                className: "hidden"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 382,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step8Media.tsx",
                        lineNumber: 287,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                        size: 18,
                                        className: "text-sage"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 395,
                                        columnNumber: 13
                                    }, this),
                                    "Voice Recordings (Optional)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 394,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mb-4",
                                children: "Do you have recordings of their voice?"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 398,
                                columnNumber: 11
                            }, this),
                            data.voiceRecordings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3 mb-4",
                                children: data.voiceRecordings.map((recording)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 p-4 bg-white border border-sand/40 rounded-xl",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                                size: 18,
                                                className: "text-terracotta flex-shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                lineNumber: 408,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: recording.title,
                                                onChange: (e)=>updateVoiceTitle(recording.id, e.target.value),
                                                placeholder: "Recording title...",
                                                className: "flex-1 px-3 py-2 border border-sand/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-sage/30 text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                lineNumber: 409,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>removeVoiceRecording(recording.id),
                                                className: "p-2 hover:bg-sand/20 rounded-lg transition-all",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    size: 16,
                                                    className: "text-charcoal/40"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step8Media.tsx",
                                                    lineNumber: 420,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                                lineNumber: 416,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, recording.id, true, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 404,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 402,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>voiceRef.current?.click(),
                                className: "w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 430,
                                        columnNumber: 13
                                    }, this),
                                    "Upload Voice Recording (MP3, WAV, etc.)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 426,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: voiceRef,
                                type: "file",
                                accept: "audio/*",
                                multiple: true,
                                onChange: handleVoiceUpload,
                                className: "hidden"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 433,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step8Media.tsx",
                        lineNumber: 393,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2 text-sm font-medium text-charcoal mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step8Media.tsx",
                                        lineNumber: 446,
                                        columnNumber: 13
                                    }, this),
                                    "Final Legacy Statement"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 445,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-charcoal/40 mb-4",
                                children: "In your own words, what is their legacy? What do you want future generations to know?"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 449,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: data.legacyStatement,
                                onChange: (e)=>handleChange('legacyStatement', e.target.value),
                                placeholder: "Write your final thoughts about their legacy and impact...      What did they stand for? How did they make the world better? What will their memory inspire in others?",
                                rows: 8,
                                className: "w-full px-6 py-4 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none font-serif text-base leading-relaxed"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 452,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 p-4 bg-gradient-to-br from-terracotta/5 to-sage/5 rounded-lg border border-sand/30",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-charcoal/60 leading-relaxed",
                                    children: "💡 This statement will appear prominently on the memorial page. Think about what you'd want their great-grandchildren to know about them."
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step8Media.tsx",
                                    lineNumber: 462,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step8Media.tsx",
                                lineNumber: 461,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step8Media.tsx",
                        lineNumber: 444,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step8Media.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-12 flex gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onBack,
                        className: "px-6 py-4 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all font-medium",
                        children: "← Back"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step8Media.tsx",
                        lineNumber: 471,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onNext,
                        className: "flex-1 bg-terracotta hover:bg-terracotta/90 text-ivory py-4 px-6 rounded-xl font-medium transition-all",
                        children: "Save & Continue to Videos →"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step8Media.tsx",
                        lineNumber: 477,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step8Media.tsx",
                lineNumber: 470,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onNext,
                    className: "text-sm text-charcoal/60 hover:text-charcoal transition-colors",
                    children: "I'll fill this in later →"
                }, void 0, false, {
                    fileName: "[project]/components/wizard/Step8Media.tsx",
                    lineNumber: 487,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/wizard/Step8Media.tsx",
                lineNumber: 486,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wizard/Step8Media.tsx",
        lineNumber: 156,
        columnNumber: 5
    }, this);
}
_s(Step8Media, "UJG9GuLVpfUo9+OO/RVu6zbiRQo=");
_c = Step8Media;
var _c;
__turbopack_context__.k.register(_c, "Step8Media");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/types/concierge.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// types/concierge.ts
// ============================================
// CONCIERGE PROJECT TYPES
// ============================================
__turbopack_context__.s([
    "CONCIERGE_STATUS_CONFIG",
    ()=>CONCIERGE_STATUS_CONFIG,
    "formatFileSize",
    ()=>formatFileSize,
    "getFileCategory",
    ()=>getFileCategory,
    "isImageFile",
    ()=>isImageFile,
    "isValidEmail",
    ()=>isValidEmail
]);
const CONCIERGE_STATUS_CONFIG = {
    requested: {
        label: 'Requested',
        color: 'text-charcoal/60',
        bgColor: 'bg-sand/20',
        description: 'We\'ll contact you soon to schedule your first call'
    },
    in_progress: {
        label: 'In Progress',
        color: 'text-sage',
        bgColor: 'bg-sage/10',
        description: 'Your archive is being carefully created'
    },
    in_review: {
        label: 'In Review',
        color: 'text-terracotta',
        bgColor: 'bg-terracotta/10',
        description: 'We\'re finalizing the details'
    },
    finalized: {
        label: 'Complete',
        color: 'text-sage',
        bgColor: 'bg-sage/20',
        description: 'Your archive is ready'
    }
};
const formatFileSize = (bytes)=>{
    if (!bytes) return '0 B';
    const sizes = [
        'B',
        'KB',
        'MB',
        'GB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};
const getFileCategory = (mimeType)=>{
    if (mimeType.startsWith('image/')) return 'Photo';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType.includes('pdf')) return 'Document';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'Spreadsheet';
    if (mimeType.includes('text')) return 'Text';
    return 'File';
};
const isImageFile = (mimeType)=>{
    return mimeType.startsWith('image/');
};
const isValidEmail = (email)=>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/supabase.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// lib/supabase.ts - UPDATED
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$concierge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/concierge.ts [app-client] (ecmascript)");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://dvfmmhxwbjglpdlujrqj.supabase.co") || '';
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2Zm1taHh3YmpnbHBkbHVqcnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNjMyNTgsImV4cCI6MjA4NDkzOTI1OH0.o1nVYNGY802-IgSXSLydeuJ9HQFD9EbNhFuoVnWOQrg") || '';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/TutorialPopup.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TutorialPopup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function TutorialPopup({ steps, onComplete, onSkip }) {
    _s();
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const goToNext = ()=>{
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };
    const goToPrevious = ()=>{
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    const step = steps[currentStep];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[100] flex items-center justify-center p-100 bg-black/20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow-2xl p-6 w-full animate-fadeIn border border-sand/20",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-8 h-8 bg-sage/10 rounded-full flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sage font-semibold text-sm",
                                                children: currentStep + 1
                                            }, void 0, false, {
                                                fileName: "[project]/components/TutorialPopup.tsx",
                                                lineNumber: 48,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/TutorialPopup.tsx",
                                            lineNumber: 47,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-serif text-xl text-charcoal",
                                            children: step.title
                                        }, void 0, false, {
                                            fileName: "[project]/components/TutorialPopup.tsx",
                                            lineNumber: 52,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/TutorialPopup.tsx",
                                    lineNumber: 46,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-charcoal/70 leading-relaxed",
                                    children: step.description
                                }, void 0, false, {
                                    fileName: "[project]/components/TutorialPopup.tsx",
                                    lineNumber: 54,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TutorialPopup.tsx",
                            lineNumber: 45,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center gap-2 mb-4",
                            children: steps.map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `h-1.5 rounded-full transition-all ${idx === currentStep ? 'w-8 bg-sage' : idx < currentStep ? 'w-1.5 bg-sage/50' : 'w-1.5 bg-sand/40'}`
                                }, idx, false, {
                                    fileName: "[project]/components/TutorialPopup.tsx",
                                    lineNumber: 62,
                                    columnNumber: 29
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/TutorialPopup.tsx",
                            lineNumber: 60,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            children: [
                                currentStep > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: goToPrevious,
                                    className: "flex-1 py-2.5 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all flex items-center justify-center gap-2 font-medium text-charcoal",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/components/TutorialPopup.tsx",
                                            lineNumber: 81,
                                            columnNumber: 33
                                        }, this),
                                        "Back"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/TutorialPopup.tsx",
                                    lineNumber: 77,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: goToNext,
                                    className: "flex-1 py-2.5 bg-sage hover:bg-sage/90 text-ivory rounded-xl transition-all flex items-center justify-center gap-2 font-medium",
                                    children: [
                                        currentStep < steps.length - 1 ? 'Next' : 'Got it!',
                                        currentStep < steps.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/components/TutorialPopup.tsx",
                                            lineNumber: 90,
                                            columnNumber: 64
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/TutorialPopup.tsx",
                                    lineNumber: 85,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TutorialPopup.tsx",
                            lineNumber: 75,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onSkip,
                            className: "w-full mt-3 text-sm text-charcoal/60 hover:text-charcoal transition-colors",
                            children: "Skip tutorial"
                        }, void 0, false, {
                            fileName: "[project]/components/TutorialPopup.tsx",
                            lineNumber: 95,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/TutorialPopup.tsx",
                    lineNumber: 41,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/TutorialPopup.tsx",
                lineNumber: 39,
                columnNumber: 13
            }, this),
            ");"
        ]
    }, void 0, true, {
        fileName: "[project]/components/TutorialPopup.tsx",
        lineNumber: 38,
        columnNumber: 9
    }, this);
}
_s(TutorialPopup, "1sJm2lQ2mRX7Y0EEARB7TDldOEM=");
_c = TutorialPopup;
var _c;
__turbopack_context__.k.register(_c, "TutorialPopup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wizard/Step9Videos.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Step9Videos
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/film.js [app-client] (ecmascript) <export default as Film>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TutorialPopup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/TutorialPopup.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function Step9Videos({ data, onUpdate, onNext, onBack, memorialId }) {
    _s();
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadError, setUploadError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploadProgress, setUploadProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showTutorial, setShowTutorial] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Step9Videos.useEffect": ()=>{
            // FIXED: Show tutorial every time user visits Step 9
            // We check if they have any videos - if not, show tutorial
            if (data.videos.length === 0) {
                setTimeout({
                    "Step9Videos.useEffect": ()=>{
                        setShowTutorial(true);
                    }
                }["Step9Videos.useEffect"], 500);
            }
        }
    }["Step9Videos.useEffect"], []); // Empty dependency array - runs once when component mounts
    const handleTutorialComplete = ()=>{
        setShowTutorial(false);
    };
    const handleTutorialSkip = ()=>{
        setShowTutorial(false);
    };
    const tutorialSteps = [
        {
            target: '[data-tutorial="videos"]',
            title: 'Add Videos',
            description: 'Share videos that capture their voice, spirit, and memorable moments. Please stay on this page until the upload is complete!',
            position: 'bottom'
        }
    ];
    const handleVideoUpload = async (e)=>{
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        if (!memorialId) {
            setUploadError("Please save the memorial first (Basic Info step) before uploading videos.");
            return;
        }
        setUploading(true);
        setUploadError(null);
        const newVideos = [];
        for(let i = 0; i < files.length; i++){
            const file = files[i];
            setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);
            // Check file size (50MB limit)
            if (file.size > 50 * 1024 * 1024) {
                setUploadError(`File "${file.name}" is too large (max 50MB). Please compress it first.`);
                continue;
            }
            try {
                const fileExt = file.name.split('.').pop() || 'mp4';
                const videoUuid = crypto.randomUUID();
                const videoPath = `${memorialId}/${videoUuid}.${fileExt}`;
                // Upload video to Supabase Storage
                const { data: uploadData, error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["supabase"].storage.from('videos').upload(videoPath, file, {
                    contentType: file.type,
                    upsert: false
                });
                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    throw new Error(`Upload failed: ${uploadError.message}`);
                }
                // Get public URL for the video
                const { data: videoPublic } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["supabase"].storage.from('videos').getPublicUrl(videoPath);
                // Generate thumbnail
                let thumbnailUrl = '';
                try {
                    const thumbnailBlob = await generateThumbnail(file);
                    const thumbnailPath = `${memorialId}/thumbnails/${videoUuid}.png`;
                    const { error: thumbError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["supabase"].storage.from('videos').upload(thumbnailPath, thumbnailBlob, {
                        contentType: 'image/png',
                        upsert: false
                    });
                    if (!thumbError) {
                        const { data: thumbPublic } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["supabase"].storage.from('videos').getPublicUrl(thumbnailPath);
                        thumbnailUrl = thumbPublic.publicUrl;
                    }
                } catch (thumbErr) {
                    console.warn('Thumbnail generation failed, using default:', thumbErr);
                // Continue without thumbnail - video will still work
                }
                // Get duration
                const duration = await getVideoDuration(file);
                newVideos.push({
                    id: videoUuid,
                    url: videoPublic.publicUrl,
                    thumbnail: thumbnailUrl || videoPublic.publicUrl,
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    duration
                });
            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
                setUploadError(`Failed to upload "${file.name}": ${error.message}`);
            }
        }
        if (newVideos.length > 0) {
            onUpdate({
                videos: [
                    ...data.videos,
                    ...newVideos
                ]
            });
        }
        setUploading(false);
        setUploadProgress('');
        // Reset input
        if (videoRef.current) videoRef.current.value = '';
    };
    const generateThumbnail = (file)=>{
        return new Promise((resolve, reject)=>{
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            video.preload = 'metadata';
            video.muted = true;
            video.playsInline = true;
            video.onloadeddata = ()=>{
                video.currentTime = Math.min(1, video.duration / 2); // Seek to 1s or middle
            };
            video.onseeked = ()=>{
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob)=>{
                    URL.revokeObjectURL(video.src);
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Thumbnail generation failed'));
                    }
                }, 'image/png');
            };
            video.onerror = (e)=>{
                URL.revokeObjectURL(video.src);
                reject(new Error('Video load failed'));
            };
            video.src = URL.createObjectURL(file);
        });
    };
    const getVideoDuration = (file)=>{
        return new Promise((resolve)=>{
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.muted = true;
            video.playsInline = true;
            video.onloadedmetadata = ()=>{
                const mins = Math.floor(video.duration / 60);
                const secs = Math.floor(video.duration % 60);
                URL.revokeObjectURL(video.src);
                resolve(`${mins}:${secs.toString().padStart(2, '0')}`);
            };
            video.onerror = ()=>{
                URL.revokeObjectURL(video.src);
                resolve("0:00");
            };
            video.src = URL.createObjectURL(file);
        });
    };
    const removeVideo = async (id)=>{
        if (!confirm('Are you sure you want to remove this video?')) return;
        // Find the video to get its path
        const video = data.videos.find((v)=>v.id === id);
        if (video && memorialId) {
            // Optional: Delete from storage
            try {
                const videoPath = `${memorialId}/${id}`;
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["supabase"].storage.from('videos').remove([
                    `${videoPath}.mp4`,
                    `${videoPath}.mov`,
                    `${videoPath}/thumbnails/${id}.png`
                ]);
            } catch (err) {
                console.warn('Could not delete video from storage:', err);
            }
        }
        onUpdate({
            videos: data.videos.filter((v)=>v.id !== id)
        });
    };
    const updateVideoTitle = (id, title)=>{
        onUpdate({
            videos: data.videos.map((v)=>v.id === id ? {
                    ...v,
                    title
                } : v)
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-4xl mx-auto px-6 py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-serif text-4xl text-charcoal mb-3",
                        children: "Video Memories"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-charcoal/60 text-lg",
                        children: "Share videos that capture their voice, spirit, and memorable moments."
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                        lineNumber: 249,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step9Videos.tsx",
                lineNumber: 245,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-8",
                children: [
                    uploadError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                size: 20,
                                className: "text-red-600 flex-shrink-0 mt-0.5"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                lineNumber: 258,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-medium text-red-800 mb-1",
                                        children: "Upload Error"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                                        lineNumber: 260,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-red-700",
                                        children: uploadError
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                                        lineNumber: 261,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                lineNumber: 259,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setUploadError(null),
                                className: "text-red-600 hover:text-red-800",
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                lineNumber: 263,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 bg-gradient-to-br from-terracotta/5 to-sage/5 rounded-xl border border-sand/30",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-charcoal mb-3 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__["Film"], {
                                        size: 18,
                                        className: "text-terracotta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                                        lineNumber: 275,
                                        columnNumber: 13
                                    }, this),
                                    "📹 Video Guidelines"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                lineNumber: 274,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-2 text-sm text-charcoal/70",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex items-start gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sage mt-0.5",
                                                children: "•"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                lineNumber: 280,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Best quality:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 21
                                                    }, this),
                                                    " MP4 format recommended"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                lineNumber: 281,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                                        lineNumber: 279,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex items-start gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sage mt-0.5",
                                                children: "•"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                lineNumber: 284,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "File size:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Maximum 50MB per video"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                lineNumber: 285,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                                        lineNumber: 283,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex items-start gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-terracotta mt-0.5",
                                                children: "⚠️"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                lineNumber: 288,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Important:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                        lineNumber: 289,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Stay on this page until upload completes!"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                lineNumber: 289,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                                        lineNumber: 287,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                        lineNumber: 273,
                        columnNumber: 9
                    }, this),
                    data.videos.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-charcoal mb-4",
                                children: [
                                    "Uploaded Videos (",
                                    data.videos.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                lineNumber: 297,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",
                                children: data.videos.map((video)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative p-4 bg-white border-2 border-sand/40 rounded-xl group hover:border-sage/40 transition-all",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative aspect-video rounded-lg overflow-hidden bg-charcoal/10 mb-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                    controls: true,
                                                    preload: "metadata",
                                                    className: "w-full h-full object-cover",
                                                    poster: video.thumbnail,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                                                            src: video.url,
                                                            type: "video/mp4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                            lineNumber: 314,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Your browser does not support the video tag."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                    lineNumber: 308,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                lineNumber: 307,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: video.title,
                                                onChange: (e)=>updateVideoTitle(video.id, e.target.value),
                                                placeholder: "Video title...",
                                                className: "w-full px-3 py-2 border border-sand/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/30 text-sm font-medium mb-2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                lineNumber: 320,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between text-xs text-charcoal/60",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__["Film"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                                lineNumber: 331,
                                                                columnNumber: 23
                                                            }, this),
                                                            " Video"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                        lineNumber: 330,
                                                        columnNumber: 21
                                                    }, this),
                                                    video.duration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                                lineNumber: 335,
                                                                columnNumber: 25
                                                            }, this),
                                                            video.duration
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                lineNumber: 329,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>removeVideo(video.id),
                                                className: "absolute top-2 right-2 p-2 bg-charcoal/80 hover:bg-charcoal rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg",
                                                title: "Remove video",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    size: 14,
                                                    className: "text-ivory"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                                lineNumber: 342,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, video.id, true, {
                                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                                        lineNumber: 302,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step9Videos.tsx",
                                lineNumber: 300,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                        lineNumber: 296,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>!uploading && videoRef.current?.click(),
                        "data-tutorial": "videos",
                        className: `border-2 border-dashed border-sand/40 rounded-xl p-16 text-center cursor-pointer hover:border-sage/40 hover:bg-sage/5 transition-all ${uploading ? 'opacity-70 cursor-wait' : ''}`,
                        children: uploading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step9Videos.tsx",
                                    lineNumber: 364,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sage font-medium text-lg",
                                    children: uploadProgress
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step9Videos.tsx",
                                    lineNumber: 365,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-charcoal/60 text-sm mt-2",
                                    children: "⚠️ Please stay on this page until upload completes"
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step9Videos.tsx",
                                    lineNumber: 366,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/wizard/Step9Videos.tsx",
                            lineNumber: 363,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6 relative inline-block",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-24 h-24 bg-gradient-to-br from-terracotta/20 to-sage/20 rounded-full flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__["Film"], {
                                            size: 48,
                                            className: "text-charcoal/40"
                                        }, void 0, false, {
                                            fileName: "[project]/components/wizard/Step9Videos.tsx",
                                            lineNumber: 372,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                                        lineNumber: 371,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step9Videos.tsx",
                                    lineNumber: 370,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-charcoal mb-2",
                                    children: data.videos.length === 0 ? "Upload Your First Video" : "Add More Videos"
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step9Videos.tsx",
                                    lineNumber: 375,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-charcoal/60 mb-6 max-w-md mx-auto",
                                    children: "Click here to upload video files. You can select multiple videos at once."
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step9Videos.tsx",
                                    lineNumber: 378,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-flex items-center gap-2 px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-xl font-medium transition-all",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/components/wizard/Step9Videos.tsx",
                                            lineNumber: 382,
                                            columnNumber: 17
                                        }, this),
                                        "Choose Video Files"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/wizard/Step9Videos.tsx",
                                    lineNumber: 381,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                        lineNumber: 356,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: videoRef,
                        type: "file",
                        accept: "video/*",
                        multiple: true,
                        onChange: handleVideoUpload,
                        className: "hidden",
                        disabled: uploading
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                        lineNumber: 389,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step9Videos.tsx",
                lineNumber: 254,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-12 flex gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onBack,
                        disabled: uploading,
                        className: "px-6 py-4 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all font-medium disabled:opacity-50",
                        children: "← Back"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                        lineNumber: 402,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onNext,
                        disabled: uploading,
                        className: "flex-1 bg-terracotta hover:bg-terracotta/90 text-ivory py-4 px-6 rounded-xl font-medium transition-all disabled:opacity-50",
                        children: data.videos.length > 0 ? 'Save & Continue to Review →' : 'Skip Videos & Continue →'
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step9Videos.tsx",
                        lineNumber: 409,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step9Videos.tsx",
                lineNumber: 401,
                columnNumber: 7
            }, this),
            showTutorial && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TutorialPopup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                steps: tutorialSteps,
                onComplete: handleTutorialComplete,
                onSkip: handleTutorialSkip
            }, void 0, false, {
                fileName: "[project]/components/wizard/Step9Videos.tsx",
                lineNumber: 420,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wizard/Step9Videos.tsx",
        lineNumber: 244,
        columnNumber: 5
    }, this);
}
_s(Step9Videos, "GHSNJWGZD9sTTT1SeJML+KjIbhM=");
_c = Step9Videos;
var _c;
__turbopack_context__.k.register(_c, "Step9Videos");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wizard/PreviewModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PreviewModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/quote.js [app-client] (ecmascript) <export default as Quote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
// components/wizard/PreviewModal.tsx
'use client';
;
;
function PreviewModal({ data, onClose }) {
    const calculateAge = ()=>{
        if (!data.step1.birthDate) return null;
        const birth = new Date(data.step1.birthDate);
        const end = data.step1.isStillLiving ? new Date() : data.step1.deathDate ? new Date(data.step1.deathDate) : new Date();
        const years = end.getFullYear() - birth.getFullYear();
        return years;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-charcoal/90 backdrop-blur-sm z-50 overflow-y-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen py-12 px-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-5xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-6 px-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-semibold text-ivory mb-1",
                                        children: "Memorial Preview"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                        lineNumber: 28,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-ivory/60 text-sm",
                                        children: "This is how your memorial will look to visitors"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                        lineNumber: 29,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                lineNumber: 27,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "p-3 bg-ivory/10 hover:bg-ivory/20 rounded-full transition-all",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 24,
                                    className: "text-ivory"
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/PreviewModal.tsx",
                                    lineNumber: 35,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                lineNumber: 31,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                        lineNumber: 26,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-ivory rounded-2xl shadow-2xl overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative h-80 bg-gradient-to-br from-sage/20 to-terracotta/20",
                                children: [
                                    data.step8.coverPhotoPreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: data.step8.coverPhotoPreview,
                                        alt: "Cover",
                                        className: "w-full h-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                        lineNumber: 44,
                                        columnNumber: 33
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-full flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                            size: 64,
                                            className: "text-charcoal/20"
                                        }, void 0, false, {
                                            fileName: "[project]/components/wizard/PreviewModal.tsx",
                                            lineNumber: 51,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                        lineNumber: 50,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                        lineNumber: 54,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-0 left-0 right-0 p-8",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-end gap-6",
                                            children: [
                                                data.step1.profilePhotoPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-32 h-32 rounded-2xl border-4 border-ivory shadow-2xl overflow-hidden flex-shrink-0",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: data.step1.profilePhotoPreview,
                                                        alt: data.step1.fullName,
                                                        className: "w-full h-full object-cover"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                        lineNumber: 61,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                    lineNumber: 60,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 pb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                            className: "font-serif text-4xl md:text-5xl text-ivory mb-2 drop-shadow-lg",
                                                            children: data.step1.fullName || 'Name'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                            lineNumber: 69,
                                                            columnNumber: 41
                                                        }, this),
                                                        data.step1.birthDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-ivory/90 text-lg flex items-center gap-2 drop-shadow",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                    size: 18
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                                    lineNumber: 74,
                                                                    columnNumber: 49
                                                                }, this),
                                                                new Date(data.step1.birthDate).getFullYear(),
                                                                " - ",
                                                                data.step1.isStillLiving ? 'Present' : data.step1.deathDate ? new Date(data.step1.deathDate).getFullYear() : 'Present',
                                                                calculateAge() && ` • ${calculateAge()} years`
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                            lineNumber: 73,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                    lineNumber: 68,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/wizard/PreviewModal.tsx",
                                            lineNumber: 58,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                        lineNumber: 57,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                lineNumber: 42,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-8 md:p-12 space-y-12",
                                children: [
                                    data.step1.epitaph && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-6 border-y border-sand/30",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__["Quote"], {
                                                size: 32,
                                                className: "text-terracotta mx-auto mb-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 89,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-serif text-2xl text-charcoal/80 italic leading-relaxed max-w-3xl mx-auto",
                                                children: [
                                                    '"',
                                                    data.step1.epitaph,
                                                    '"'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 90,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                        lineNumber: 88,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                        children: [
                                            data.step1.birthPlace && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-3 p-4 bg-sage/5 rounded-xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                        size: 20,
                                                        className: "text-sage mt-1 flex-shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                        lineNumber: 100,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-medium text-charcoal/60 mb-1",
                                                                children: "Born in"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                                lineNumber: 102,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-charcoal font-medium",
                                                                children: data.step1.birthPlace
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                                lineNumber: 103,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                        lineNumber: 101,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 99,
                                                columnNumber: 37
                                            }, this),
                                            data.step3.occupations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-3 p-4 bg-terracotta/5 rounded-xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
                                                        size: 20,
                                                        className: "text-terracotta mt-1 flex-shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                        lineNumber: 110,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-medium text-charcoal/60 mb-1",
                                                                children: "Career"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                                lineNumber: 112,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-charcoal font-medium",
                                                                children: data.step3.occupations[0].title
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                                lineNumber: 113,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                        lineNumber: 111,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 109,
                                                columnNumber: 37
                                            }, this),
                                            data.step4.children.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-3 p-4 bg-sage/5 rounded-xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                                        size: 20,
                                                        className: "text-sage mt-1 flex-shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-medium text-charcoal/60 mb-1",
                                                                children: "Family"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                                lineNumber: 122,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-charcoal font-medium",
                                                                children: [
                                                                    data.step4.children.length,
                                                                    " child",
                                                                    data.step4.children.length !== 1 ? 'ren' : ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                                lineNumber: 123,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 119,
                                                columnNumber: 37
                                            }, this),
                                            data.step5.personalityTraits.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-3 p-4 bg-terracotta/5 rounded-xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                        size: 20,
                                                        className: "text-terracotta mt-1 flex-shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-medium text-charcoal/60 mb-1",
                                                                children: "Personality"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                                lineNumber: 134,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-charcoal font-medium",
                                                                children: data.step5.personalityTraits.slice(0, 3).join(', ')
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                                lineNumber: 135,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                        lineNumber: 133,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 131,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                        lineNumber: 97,
                                        columnNumber: 29
                                    }, this),
                                    data.step6.biography && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "font-serif text-3xl text-charcoal mb-4",
                                                children: "Life Story"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 146,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "prose prose-lg max-w-none",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-charcoal/80 leading-relaxed whitespace-pre-wrap",
                                                    children: [
                                                        data.step6.biography.slice(0, 500),
                                                        data.step6.biography.length > 500 && '...'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                    lineNumber: 148,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 147,
                                                columnNumber: 37
                                            }, this),
                                            data.step6.biography.length > 500 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-charcoal/40 mt-4 italic",
                                                children: "Full biography will be visible on the memorial page"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 154,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                        lineNumber: 145,
                                        columnNumber: 33
                                    }, this),
                                    data.step8.gallery.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "font-serif text-3xl text-charcoal mb-6",
                                                children: "Photo Gallery"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 164,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                                                children: data.step8.gallery.slice(0, 8).map((photo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "aspect-square rounded-xl overflow-hidden bg-sand/20",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: photo.preview,
                                                            alt: photo.caption,
                                                            className: "w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                            lineNumber: 168,
                                                            columnNumber: 49
                                                        }, this)
                                                    }, photo.id, false, {
                                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                        lineNumber: 167,
                                                        columnNumber: 45
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 165,
                                                columnNumber: 37
                                            }, this),
                                            data.step8.gallery.length > 8 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-charcoal/40 mt-4 text-center",
                                                children: [
                                                    "+",
                                                    data.step8.gallery.length - 8,
                                                    " more photos"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 177,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                        lineNumber: 163,
                                        columnNumber: 33
                                    }, this),
                                    data.step8.interactiveGallery && data.step8.interactiveGallery.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "font-serif text-3xl text-charcoal mb-4",
                                                children: "Interactive Stories"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 187,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-charcoal/60 mb-6 text-sm",
                                                children: "✨ Hover over these photos on the live memorial to reveal hidden stories"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 188,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                                children: data.step8.interactiveGallery.slice(0, 4).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative aspect-video rounded-xl overflow-hidden border-2 border-sage/20",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: item.preview,
                                                                alt: "Interactive photo",
                                                                className: "w-full h-full object-cover"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                                lineNumber: 194,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute top-2 right-2 px-3 py-1 bg-terracotta/90 text-ivory text-xs rounded-full",
                                                                children: "Interactive ✨"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                                lineNumber: 199,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, item.id, true, {
                                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 45
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 191,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                        lineNumber: 186,
                                        columnNumber: 33
                                    }, this),
                                    data.step8.legacyStatement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gradient-to-br from-sage/10 via-ivory to-terracotta/10 rounded-2xl p-8 border-2 border-sand/30",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "font-serif text-2xl text-charcoal mb-4 text-center",
                                                children: "Legacy"
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 211,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg text-charcoal/80 leading-relaxed text-center max-w-3xl mx-auto",
                                                children: data.step8.legacyStatement
                                            }, void 0, false, {
                                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                                lineNumber: 212,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                                        lineNumber: 210,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/PreviewModal.tsx",
                                lineNumber: 85,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                        lineNumber: 40,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "px-8 py-3 bg-ivory hover:bg-ivory/90 text-charcoal rounded-xl font-medium transition-all shadow-lg",
                            children: "Close Preview"
                        }, void 0, false, {
                            fileName: "[project]/components/wizard/PreviewModal.tsx",
                            lineNumber: 222,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/PreviewModal.tsx",
                        lineNumber: 221,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/PreviewModal.tsx",
                lineNumber: 24,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/wizard/PreviewModal.tsx",
            lineNumber: 23,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/wizard/PreviewModal.tsx",
        lineNumber: 22,
        columnNumber: 9
    }, this);
}
_c = PreviewModal;
var _c;
__turbopack_context__.k.register(_c, "PreviewModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/wizard/Step10Review.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Step10Review
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/film.js [app-client] (ecmascript) <export default as Film>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$PreviewModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wizard/PreviewModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// components/wizard/Step10Review.tsx - RENAMED AND UPDATED
'use client';
;
;
;
function Step10Review({ data, onBack, onJumpToStep }) {
    _s();
    const [isPublishing, setIsPublishing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPreview, setShowPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Check completion status for each step
    const stepCompletion = {
        step1: !!(data.step1.fullName && data.step1.birthDate),
        step2: !!(data.step2.familyBackground || data.step2.childhoodHome),
        step3: !!(data.step3.occupations.length > 0),
        step4: !!(data.step4.partners.length > 0 || data.step4.children.length > 0),
        step5: !!(data.step5.personalityTraits.length > 0 || data.step5.coreValues.length > 0),
        step6: !!(data.step6.biography.trim().length > 100),
        step7: !!(data.step7.sharedMemories.length > 0 || data.step7.impactStories.length > 0),
        step8: !!(data.step8.coverPhotoPreview || data.step8.gallery.length > 0),
        step9: !!(data.step9.videos.length > 0)
    };
    const completedSteps = Object.values(stepCompletion).filter(Boolean).length;
    const totalSteps = 9; // Total steps excluding review
    const completionPercentage = Math.round(completedSteps / totalSteps * 100);
    const handlePublish = async ()=>{
        setIsPublishing(true);
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        window.location.href = '/success';
    };
    const sections = [
        {
            step: 1,
            title: 'Basic Information',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
            color: 'text-terracotta',
            bgColor: 'bg-terracotta/10',
            completed: stepCompletion.step1,
            summary: data.step1.fullName ? `${data.step1.fullName} • ${data.step1.birthDate}${data.step1.deathDate ? ` - ${data.step1.deathDate}` : ' (Living)'}` : 'Not completed'
        },
        {
            step: 2,
            title: 'Early Life & Childhood',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
            color: 'text-sage',
            bgColor: 'bg-sage/10',
            completed: stepCompletion.step2,
            summary: data.step2.childhoodHome ? `${data.step2.schools.highSchool || 'Schools added'} • ${data.step2.childhoodPersonality.length} traits` : 'Not completed'
        },
        {
            step: 3,
            title: 'Career & Education',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"],
            color: 'text-terracotta',
            bgColor: 'bg-terracotta/10',
            completed: stepCompletion.step3,
            summary: data.step3.occupations.length > 0 ? `${data.step3.occupations.length} job${data.step3.occupations.length !== 1 ? 's' : ''} • ${data.step3.careerHighlights.length} highlights` : 'Not completed'
        },
        {
            step: 4,
            title: 'Relationships & Family',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
            color: 'text-sage',
            bgColor: 'bg-sage/10',
            completed: stepCompletion.step4,
            summary: data.step4.partners.length + data.step4.children.length > 0 ? `${data.step4.partners.length} partner${data.step4.partners.length !== 1 ? 's' : ''} • ${data.step4.children.length} child${data.step4.children.length !== 1 ? 'ren' : ''}` : 'Not completed'
        },
        {
            step: 5,
            title: 'Personality, Values & Passions',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
            color: 'text-terracotta',
            bgColor: 'bg-terracotta/10',
            completed: stepCompletion.step5,
            summary: data.step5.personalityTraits.length + data.step5.coreValues.length > 0 ? `${data.step5.personalityTraits.length} traits • ${data.step5.coreValues.length} values` : 'Not completed'
        },
        {
            step: 6,
            title: 'Full Life Story',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
            color: 'text-sage',
            bgColor: 'bg-sage/10',
            completed: stepCompletion.step6,
            summary: data.step6.biography.trim().length > 0 ? `${data.step6.biography.trim().split(/\s+/).length} words • ${data.step6.lifeChapters.length} chapters` : 'Not completed'
        },
        {
            step: 7,
            title: 'Memories & Stories',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"],
            color: 'text-terracotta',
            bgColor: 'bg-terracotta/10',
            completed: stepCompletion.step7,
            summary: data.step7.sharedMemories.length + data.step7.impactStories.length > 0 ? `${data.step7.sharedMemories.length} memories • ${data.step7.impactStories.length} impact stories` : 'Not completed'
        },
        {
            step: 8,
            title: 'Photos & Legacy',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"],
            color: 'text-sage',
            bgColor: 'bg-sage/10',
            completed: stepCompletion.step8,
            summary: data.step8.gallery.length > 0 ? `${data.step8.gallery.length} photos • ${data.step8.voiceRecordings.length} recordings` : 'Not completed'
        },
        {
            step: 9,
            title: 'Videos',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__["Film"],
            color: 'text-terracotta',
            bgColor: 'bg-terracotta/10',
            completed: stepCompletion.step9,
            summary: data.step9.videos.length > 0 ? `${data.step9.videos.length} video${data.step9.videos.length !== 1 ? 's' : ''}` : 'Not completed'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-4xl mx-auto px-6 py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-serif text-4xl text-charcoal mb-3",
                        children: "Review & Publish"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step10Review.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-charcoal/60 text-lg",
                        children: "Almost there! Review your memorial and publish when ready."
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step10Review.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step10Review.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-10 p-6 bg-gradient-to-br from-sage/10 via-ivory to-terracotta/10 rounded-xl border-2 border-sage/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-charcoal mb-1",
                                        children: "Memorial Completion"
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step10Review.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-charcoal/60",
                                        children: [
                                            completedSteps,
                                            " of ",
                                            totalSteps,
                                            " sections completed"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/wizard/Step10Review.tsx",
                                        lineNumber: 159,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/wizard/Step10Review.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-right",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-3xl font-bold text-sage",
                                    children: [
                                        completionPercentage,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/wizard/Step10Review.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step10Review.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step10Review.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3 bg-sand/30 rounded-full overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full bg-gradient-to-r from-sage to-terracotta rounded-full transition-all duration-500",
                            style: {
                                width: `${completionPercentage}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/wizard/Step10Review.tsx",
                            lineNumber: 168,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step10Review.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this),
                    completionPercentage < 100 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex items-start gap-2 text-sm text-charcoal/60",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                size: 16,
                                className: "flex-shrink-0 mt-0.5 text-terracotta"
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step10Review.tsx",
                                lineNumber: 175,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "You can publish now, or go back and complete more sections for a richer memorial."
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step10Review.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step10Review.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step10Review.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4 mb-10",
                children: sections.map((section)=>{
                    const Icon = section.icon;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `p-5 rounded-xl border-2 transition-all ${section.completed ? 'bg-white border-sand/30' : 'bg-sand/5 border-sand/20'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `flex-shrink-0 w-12 h-12 rounded-xl ${section.bgColor} flex items-center justify-center`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        size: 24,
                                        className: section.color
                                    }, void 0, false, {
                                        fileName: "[project]/components/wizard/Step10Review.tsx",
                                        lineNumber: 197,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step10Review.tsx",
                                    lineNumber: 196,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start justify-between gap-4 mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-semibold text-charcoal",
                                                            children: section.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step10Review.tsx",
                                                            lineNumber: 202,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-charcoal/60 mt-0.5",
                                                            children: section.summary
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step10Review.tsx",
                                                            lineNumber: 203,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step10Review.tsx",
                                                    lineNumber: 201,
                                                    columnNumber: 21
                                                }, this),
                                                section.completed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5 px-3 py-1 bg-sage/10 text-sage rounded-full text-xs font-medium",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                            size: 14
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step10Review.tsx",
                                                            lineNumber: 207,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Complete"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step10Review.tsx",
                                                    lineNumber: 206,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5 px-3 py-1 bg-sand/20 text-charcoal/40 rounded-full text-xs font-medium",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                            size: 14
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/wizard/Step10Review.tsx",
                                                            lineNumber: 212,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Optional"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/wizard/Step10Review.tsx",
                                                    lineNumber: 211,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/wizard/Step10Review.tsx",
                                            lineNumber: 200,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onJumpToStep(section.step),
                                            className: "text-sm text-terracotta hover:text-terracotta/80 transition-colors flex items-center gap-1.5 mt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/components/wizard/Step10Review.tsx",
                                                    lineNumber: 221,
                                                    columnNumber: 21
                                                }, this),
                                                "Edit this section"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/wizard/Step10Review.tsx",
                                            lineNumber: 217,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/wizard/Step10Review.tsx",
                                    lineNumber: 199,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/wizard/Step10Review.tsx",
                            lineNumber: 195,
                            columnNumber: 15
                        }, this)
                    }, section.step, false, {
                        fileName: "[project]/components/wizard/Step10Review.tsx",
                        lineNumber: 188,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/wizard/Step10Review.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowPreview(true),
                        className: "w-full py-4 px-6 bg-white border-2 border-sage rounded-xl text-sage font-medium hover:bg-sage/5 transition-all flex items-center justify-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step10Review.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this),
                            "Preview Memorial"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step10Review.tsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handlePublish,
                        disabled: isPublishing || !stepCompletion.step1,
                        className: `w-full py-5 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-lg ${isPublishing || !stepCompletion.step1 ? 'bg-sand/30 text-charcoal/40 cursor-not-allowed' : 'bg-gradient-to-r from-sage to-terracotta hover:shadow-lg text-ivory'}`,
                        children: isPublishing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step10Review.tsx",
                                    lineNumber: 251,
                                    columnNumber: 15
                                }, this),
                                "Publishing..."
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/components/wizard/Step10Review.tsx",
                                    lineNumber: 256,
                                    columnNumber: 15
                                }, this),
                                "Publish Memorial"
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step10Review.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this),
                    !stepCompletion.step1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-center text-terracotta",
                        children: "Please complete at least the Basic Information section to publish"
                    }, void 0, false, {
                        fileName: "[project]/components/wizard/Step10Review.tsx",
                        lineNumber: 263,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onBack,
                        className: "w-full py-3 px-6 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all flex items-center justify-center gap-2 text-charcoal/60",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/components/wizard/Step10Review.tsx",
                                lineNumber: 272,
                                columnNumber: 11
                            }, this),
                            "Back to Previous Step"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/wizard/Step10Review.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/wizard/Step10Review.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-8 p-4 bg-sage/5 rounded-lg border border-sage/20 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-charcoal/60",
                    children: "💾 Your work is automatically saved. You can close this page and come back anytime."
                }, void 0, false, {
                    fileName: "[project]/components/wizard/Step10Review.tsx",
                    lineNumber: 279,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/wizard/Step10Review.tsx",
                lineNumber: 278,
                columnNumber: 7
            }, this),
            showPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$PreviewModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                data: data,
                onClose: ()=>setShowPreview(false)
            }, void 0, false, {
                fileName: "[project]/components/wizard/Step10Review.tsx",
                lineNumber: 286,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/wizard/Step10Review.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
}
_s(Step10Review, "nBSdJIvKqVmkk+vpGBERQ3hToz0=");
_c = Step10Review;
var _c;
__turbopack_context__.k.register(_c, "Step10Review");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/create/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreateMemorialPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$ProgressBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wizard/ProgressBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$PathCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wizard/PathCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$paths$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/paths-logic.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step1BasicInfo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wizard/Step1BasicInfo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step2Childhood$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wizard/Step2Childhood.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step3Career$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wizard/Step3Career.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step4Relationships$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wizard/Step4Relationships.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step5Personality$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wizard/Step5Personality.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step6LifeStory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wizard/Step6LifeStory.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step7Memories$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wizard/Step7Memories.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step8Media$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wizard/Step8Media.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step9Videos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wizard/Step9Videos.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step10Review$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/wizard/Step10Review.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TutorialPopup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/TutorialPopup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$memorial$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/memorial.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
// app/create/page.tsx - COMPLETE FILE WITH STEP 9 VIDEOS
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const getInitialData = ()=>({
        step1: {
            fullName: '',
            birthDate: '',
            deathDate: null,
            isStillLiving: false,
            birthPlace: '',
            deathPlace: '',
            profilePhoto: null,
            profilePhotoPreview: null,
            epitaph: ''
        },
        step2: {
            childhoodHome: '',
            familyBackground: '',
            schools: {
                elementary: '',
                highSchool: '',
                college: '',
                additionalEducation: ''
            },
            childhoodPersonality: [],
            earlyInterests: [],
            childhoodPhotos: []
        },
        step3: {
            occupations: [],
            careerHighlights: [],
            education: {
                major: '',
                graduationYear: '',
                honors: ''
            }
        },
        step4: {
            partners: [],
            children: [],
            majorLifeEvents: []
        },
        step5: {
            personalityTraits: [],
            coreValues: [],
            passions: [],
            lifePhilosophy: '',
            favoriteQuotes: [],
            memorableSayings: []
        },
        step6: {
            biography: '',
            lifeChapters: []
        },
        step7: {
            sharedMemories: [],
            impactStories: [],
            invitedEmails: []
        },
        step8: {
            coverPhoto: null,
            coverPhotoPreview: null,
            gallery: [],
            interactiveGallery: [],
            voiceRecordings: [],
            legacyStatement: ''
        },
        step9: {
            videos: []
        },
        currentStep: 1,
        lastSaved: new Date().toISOString(),
        completedSteps: []
    });
function CreateMemorialPageContent() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const memorialId = searchParams.get('id');
    const [memorialData, setMemorialData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(getInitialData());
    const [saveStatus, setSaveStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('saved');
    const [currentMemorialId, setCurrentMemorialId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(memorialId);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!!memorialId);
    const [showTutorial, setShowTutorial] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // NEW: Hub View States
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('hub');
    const [activePath, setActivePath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreateMemorialPageContent.useEffect": ()=>{
            if (memorialId) {
                loadMemorial(memorialId);
            }
        }
    }["CreateMemorialPageContent.useEffect"], [
        memorialId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreateMemorialPageContent.useEffect": ()=>{
            const hasSeenTutorial = localStorage.getItem('legacy-vault-tutorial-completed');
            if (!memorialId && !hasSeenTutorial) {
                setTimeout({
                    "CreateMemorialPageContent.useEffect": ()=>{
                        setShowTutorial(true);
                    }
                }["CreateMemorialPageContent.useEffect"], 500);
            }
        }
    }["CreateMemorialPageContent.useEffect"], [
        memorialId
    ]);
    const handlePathClick = (pathId)=>{
        setActivePath(pathId);
        // Map Path to your existing Steps
        const pathToStepMap = {
            facts: 1,
            body: 2,
            soul: 5,
            presence: 8
        };
        setMemorialData((prev)=>({
                ...prev,
                currentStep: pathToStepMap[pathId]
            }));
        setViewMode('path');
    };
    const tutorialSteps = [
        {
            target: '[data-tutorial="Fulle-Name"]',
            title: 'Start Your Legacy',
            description: 'The full name is where the memorial begins, creating a space dedicated to the person being honored.',
            position: 'bottom'
        },
        {
            target: '[data-tutorial="preview-button"]',
            title: 'Preview Your Memorial',
            description: 'As you add information, you can click "Preview Live Page" at any time to see how your memorial will look to visitors. This helps ensure everything appears exactly as you envision.',
            position: 'bottom'
        },
        {
            target: '[data-tutorial="save-continue"]',
            title: 'Save Your Progress',
            description: 'Click "Save & Continue" at the bottom to save your work and move to the next step. Your progress is automatically saved!',
            position: 'top'
        }
    ];
    const handleTutorialComplete = ()=>{
        localStorage.setItem('legacy-vault-tutorial-completed', 'true');
        setShowTutorial(false);
    };
    const handleTutorialSkip = ()=>{
        localStorage.setItem('legacy-vault-tutorial-completed', 'true');
        setShowTutorial(false);
    };
    const loadMemorial = async (id)=>{
        setIsLoading(true);
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["supabase"].from('memorials').select('*').eq('id', id).single();
            if (error) throw error;
            if (data) {
                setMemorialData({
                    step1: data.step1,
                    step2: data.step2,
                    step3: data.step3,
                    step4: data.step4,
                    step5: data.step5,
                    step6: data.step6,
                    step7: data.step7,
                    step8: data.step8,
                    step9: data.step9 || {
                        videos: []
                    },
                    currentStep: 1,
                    lastSaved: data.updated_at,
                    completedSteps: data.completed_steps || []
                });
                setCurrentMemorialId(id);
            }
        } catch (error) {
            console.error('Error loading memorial:', error);
            alert('Failed to load memorial');
        } finally{
            setIsLoading(false);
        }
    };
    const generateSlug = (name)=>{
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreateMemorialPageContent.useEffect": ()=>{
            const saveTimer = setTimeout({
                "CreateMemorialPageContent.useEffect.saveTimer": ()=>{
                    saveToSupabase();
                }
            }["CreateMemorialPageContent.useEffect.saveTimer"], 1000);
            return ({
                "CreateMemorialPageContent.useEffect": ()=>clearTimeout(saveTimer)
            })["CreateMemorialPageContent.useEffect"];
        }
    }["CreateMemorialPageContent.useEffect"], [
        memorialData
    ]);
    const saveToSupabase = async ()=>{
        if (!memorialData.step1.fullName) return;
        setSaveStatus('saving');
        try {
            const slug = generateSlug(memorialData.step1.fullName);
            const currentMode = localStorage.getItem('legacy-vault-mode') || 'family';
            const userId = localStorage.getItem('user-id'); // ADD THIS
            const memorialRecord = {
                step1: memorialData.step1,
                step2: memorialData.step2,
                step3: memorialData.step3,
                step4: memorialData.step4,
                step5: memorialData.step5,
                step6: memorialData.step6,
                step7: memorialData.step7,
                step8: memorialData.step8,
                step9: memorialData.step9,
                status: 'draft',
                slug: slug,
                full_name: memorialData.step1.fullName,
                birth_date: memorialData.step1.birthDate || null,
                death_date: memorialData.step1.deathDate || null,
                profile_photo_url: memorialData.step1.profilePhotoPreview || null,
                cover_photo_url: memorialData.step8.coverPhotoPreview || null,
                completed_steps: memorialData.completedSteps,
                mode: currentMode,
                user_id: userId
            };
            if (currentMemorialId) {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["supabase"].from('memorials').update(memorialRecord).eq('id', currentMemorialId);
                if (error) throw error;
            } else {
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["supabase"].from('memorials').insert([
                    memorialRecord
                ]).select().single();
                if (error) throw error;
                if (data) {
                    setCurrentMemorialId(data.id);
                    window.history.replaceState({}, '', `/create?id=${data.id}`);
                }
            }
            setSaveStatus('saved');
        } catch (error) {
            console.error('Error saving memorial:', error);
            setSaveStatus('error');
        }
    };
    const goToNextStepAndComplete = ()=>{
        if (memorialData.currentStep < __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$memorial$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOTAL_STEPS"]) {
            setMemorialData((prev)=>({
                    ...prev,
                    currentStep: prev.currentStep + 1,
                    completedSteps: prev.completedSteps.includes(prev.currentStep) ? prev.completedSteps : [
                        ...prev.completedSteps,
                        prev.currentStep
                    ]
                }));
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };
    const goToPreviousStep = ()=>{
        if (memorialData.currentStep > 1) {
            setMemorialData((prev)=>({
                    ...prev,
                    currentStep: prev.currentStep - 1
                }));
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };
    const goToStep = (step)=>{
        if (step >= 1 && step <= __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$memorial$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOTAL_STEPS"]) {
            setMemorialData((prev)=>({
                    ...prev,
                    currentStep: step,
                    completedSteps: prev.completedSteps.filter((completedStep)=>completedStep < step)
                }));
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };
    const updateStep1 = (data)=>{
        setMemorialData((prev)=>({
                ...prev,
                step1: data,
                lastSaved: new Date().toISOString()
            }));
    };
    const updateStep2 = (data)=>{
        setMemorialData((prev)=>({
                ...prev,
                step2: data,
                lastSaved: new Date().toISOString()
            }));
    };
    const updateStep3 = (data)=>{
        setMemorialData((prev)=>({
                ...prev,
                step3: data,
                lastSaved: new Date().toISOString()
            }));
    };
    const updateStep4 = (data)=>{
        setMemorialData((prev)=>({
                ...prev,
                step4: data,
                lastSaved: new Date().toISOString()
            }));
    };
    const updateStep5 = (data)=>{
        setMemorialData((prev)=>({
                ...prev,
                step5: data,
                lastSaved: new Date().toISOString()
            }));
    };
    const updateStep6 = (data)=>{
        setMemorialData((prev)=>({
                ...prev,
                step6: data,
                lastSaved: new Date().toISOString()
            }));
    };
    const updateStep7 = (data)=>{
        setMemorialData((prev)=>({
                ...prev,
                step7: data,
                lastSaved: new Date().toISOString()
            }));
    };
    const updateStep8 = (data)=>{
        setMemorialData((prev)=>({
                ...prev,
                step8: data,
                lastSaved: new Date().toISOString()
            }));
    };
    const updateStep9 = (data)=>{
        setMemorialData((prev)=>({
                ...prev,
                step9: data,
                lastSaved: new Date().toISOString()
            }));
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-ivory flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/app/create/page.tsx",
                        lineNumber: 407,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-charcoal/60",
                        children: "Loading memorial..."
                    }, void 0, false, {
                        fileName: "[project]/app/create/page.tsx",
                        lineNumber: 408,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/create/page.tsx",
                lineNumber: 406,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/create/page.tsx",
            lineNumber: 405,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-ivory relative",
        children: [
            viewMode === 'hub' ? /* --- THE HUB VIEW (The Crossroads) --- */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-6xl mx-auto px-6 py-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "font-serif text-5xl text-charcoal mb-4",
                                children: "The Crossroads"
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 420,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-lg text-charcoal/60 max-w-xl mx-auto",
                                children: "Grief is not a line, but a journey. Choose where you wish to begin today."
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 421,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/create/page.tsx",
                        lineNumber: 419,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$PathCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                id: "facts",
                                title: "The Facts",
                                description: "Birth, death, and the proof of existence. The foundation of the memory.",
                                status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$paths$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPathStatus"])(memorialData, 'facts'),
                                onClick: handlePathClick
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 427,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$PathCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                id: "body",
                                title: "The Body",
                                description: "Eras of life, from childhood to career and the families built along the way.",
                                status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$paths$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPathStatus"])(memorialData, 'body'),
                                onClick: handlePathClick
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 434,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$PathCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                id: "soul",
                                title: "The Soul",
                                description: "Personality, traits, and the full life story. Who they were in essence.",
                                status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$paths$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPathStatus"])(memorialData, 'soul'),
                                onClick: handlePathClick
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 441,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$PathCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                id: "presence",
                                title: "The Presence",
                                description: "Photos, videos, and the return of the voice. Bringing the memory back to life.",
                                status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$paths$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPathStatus"])(memorialData, 'presence'),
                                onClick: handlePathClick
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 448,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/create/page.tsx",
                        lineNumber: 426,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-20 text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/dashboard",
                            className: "text-sm text-charcoal/40 hover:text-charcoal transition-colors",
                            children: "← Save progress and exit to Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/app/create/page.tsx",
                            lineNumber: 459,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/create/page.tsx",
                        lineNumber: 458,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/create/page.tsx",
                lineNumber: 418,
                columnNumber: 9
            }, this) : /* --- THE PATH EDITOR VIEW --- */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-fadeIn",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setViewMode('hub'),
                        className: "fixed bottom-8 left-8 p-3 bg-white border border-sand/40 rounded-full hover:bg-sand/10 transition-all z-50 flex items-center gap-2 text-sm text-charcoal/60 shadow-md",
                        children: "← Back to Crossroads"
                    }, void 0, false, {
                        fileName: "[project]/app/create/page.tsx",
                        lineNumber: 468,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sticky top-0 z-50 bg-white border-b border-sand/30",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-7xl mx-auto px-6 py-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/dashboard",
                                                className: "p-2 hover:bg-sand/10 rounded-lg transition-all flex items-center gap-2 text-charcoal/60 hover:text-charcoal",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                        size: 20
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create/page.tsx",
                                                        lineNumber: 483,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "hidden md:inline",
                                                        children: "Dashboard"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create/page.tsx",
                                                        lineNumber: 484,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/create/page.tsx",
                                                lineNumber: 479,
                                                columnNumber: 19
                                            }, this),
                                            currentMemorialId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/person/${currentMemorialId}`,
                                                target: "_blank",
                                                "data-tutorial": "preview-button",
                                                className: "px-4 py-2 bg-sage/10 hover:bg-sage/20 text-sage rounded-lg transition-all flex items-center gap-2 font-medium",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create/page.tsx",
                                                        lineNumber: 493,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Preview Live Page"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/create/page.tsx",
                                                lineNumber: 487,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create/page.tsx",
                                        lineNumber: 478,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            saveStatus === 'saving' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-sm text-charcoal/60",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-4 h-4 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create/page.tsx",
                                                        lineNumber: 501,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Saving..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create/page.tsx",
                                                        lineNumber: 502,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/create/page.tsx",
                                                lineNumber: 500,
                                                columnNumber: 21
                                            }, this),
                                            saveStatus === 'saved' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-sm text-sage",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create/page.tsx",
                                                        lineNumber: 507,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Saved"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/create/page.tsx",
                                                        lineNumber: 508,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/create/page.tsx",
                                                lineNumber: 506,
                                                columnNumber: 21
                                            }, this),
                                            saveStatus === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-red-600",
                                                children: "Failed to save"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.tsx",
                                                lineNumber: 512,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create/page.tsx",
                                        lineNumber: 498,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 477,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/create/page.tsx",
                            lineNumber: 476,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/create/page.tsx",
                        lineNumber: 475,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative bg-ivory/95 border-b border-sand/30",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$ProgressBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            currentStep: memorialData.currentStep,
                            completedSteps: memorialData.completedSteps,
                            onStepClick: goToStep
                        }, void 0, false, {
                            fileName: "[project]/app/create/page.tsx",
                            lineNumber: 522,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/create/page.tsx",
                        lineNumber: 521,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pb-12",
                        children: [
                            memorialData.currentStep === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step1BasicInfo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                data: memorialData.step1,
                                onUpdate: updateStep1,
                                onNext: goToNextStepAndComplete
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 531,
                                columnNumber: 15
                            }, this),
                            memorialData.currentStep === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step2Childhood$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                data: memorialData.step2,
                                onUpdate: updateStep2,
                                onNext: goToNextStepAndComplete,
                                onBack: goToPreviousStep
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 539,
                                columnNumber: 15
                            }, this),
                            memorialData.currentStep === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step3Career$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                data: memorialData.step3,
                                onUpdate: updateStep3,
                                onNext: goToNextStepAndComplete,
                                onBack: goToPreviousStep
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 548,
                                columnNumber: 15
                            }, this),
                            memorialData.currentStep === 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step4Relationships$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                data: memorialData.step4,
                                onUpdate: updateStep4,
                                onNext: goToNextStepAndComplete,
                                onBack: goToPreviousStep
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 557,
                                columnNumber: 15
                            }, this),
                            memorialData.currentStep === 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step5Personality$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                data: memorialData.step5,
                                onUpdate: updateStep5,
                                onNext: goToNextStepAndComplete,
                                onBack: goToPreviousStep
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 566,
                                columnNumber: 15
                            }, this),
                            memorialData.currentStep === 6 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step6LifeStory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                data: memorialData.step6,
                                onUpdate: updateStep6,
                                onNext: goToNextStepAndComplete,
                                onBack: goToPreviousStep
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 575,
                                columnNumber: 15
                            }, this),
                            memorialData.currentStep === 7 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step7Memories$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                data: memorialData.step7,
                                onUpdate: updateStep7,
                                onNext: goToNextStepAndComplete,
                                onBack: goToPreviousStep
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 584,
                                columnNumber: 15
                            }, this),
                            memorialData.currentStep === 8 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step8Media$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                data: memorialData.step8,
                                onUpdate: updateStep8,
                                onNext: goToNextStepAndComplete,
                                onBack: goToPreviousStep
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 593,
                                columnNumber: 15
                            }, this),
                            memorialData.currentStep === 9 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step9Videos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                data: memorialData.step9,
                                onUpdate: updateStep9,
                                onNext: goToNextStepAndComplete,
                                onBack: goToPreviousStep,
                                memorialId: currentMemorialId
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 602,
                                columnNumber: 15
                            }, this),
                            memorialData.currentStep === 10 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$wizard$2f$Step10Review$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                data: memorialData,
                                onBack: goToPreviousStep,
                                onJumpToStep: goToStep
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.tsx",
                                lineNumber: 612,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/create/page.tsx",
                        lineNumber: 529,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/create/page.tsx",
                lineNumber: 466,
                columnNumber: 9
            }, this),
            showTutorial && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TutorialPopup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                steps: tutorialSteps,
                onComplete: handleTutorialComplete,
                onSkip: handleTutorialSkip
            }, void 0, false, {
                fileName: "[project]/app/create/page.tsx",
                lineNumber: 624,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/create/page.tsx",
        lineNumber: 415,
        columnNumber: 5
    }, this);
}
_s(CreateMemorialPageContent, "UgTkicJUi5xBJlIhBhGGDR/agVo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = CreateMemorialPageContent;
function CreateMemorialPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-ivory flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-16 h-16 border-4 border-sage/30 border-t-sage rounded-full animate-spin"
            }, void 0, false, {
                fileName: "[project]/app/create/page.tsx",
                lineNumber: 638,
                columnNumber: 9
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/app/create/page.tsx",
            lineNumber: 637,
            columnNumber: 7
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CreateMemorialPageContent, {}, void 0, false, {
            fileName: "[project]/app/create/page.tsx",
            lineNumber: 641,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/create/page.tsx",
        lineNumber: 636,
        columnNumber: 5
    }, this);
}
_c1 = CreateMemorialPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "CreateMemorialPageContent");
__turbopack_context__.k.register(_c1, "CreateMemorialPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_83da9783._.js.map