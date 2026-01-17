export type Language = 'en' | 'ar';

export const translations = {
    common: {
        en: {
            language_name: "Arabic",
            switch_lang: "Switch to Arabic",
            welcome: "Welcome to Rommaana",
            admin_panel: "Admin Panel",
            logout: "Logout",
            export_data: "Export data",
            approve: "Approve",
            reject: "Reject",
            refer_legal: "Refer to Legal",
            system_online: "AI System Online",
            vision_mesh: "Vision Mesh",
            risk_guardian: "Risk Guardian",
            sales_growth: "Sales Growth",
            how_it_works: "How it works",
            claims_workbench: "Claims Workbench",
        },
        ar: {
            language_name: "English",
            switch_lang: "التبديل إلى الإنجليزية",
            welcome: "مرحباً بكم في رمانة",
            admin_panel: "لوحة التحكم",
            logout: "تسجيل الخروج",
            export_data: "تصدير البيانات",
            approve: "موافقة",
            reject: "رفض",
            refer_legal: "الإحالة إلى القانونية",
            system_online: "نظام الذكاء الاصطناعي متصل",
            vision_mesh: "شبكة الرؤية",
            risk_guardian: "حارس المخاطر",
            sales_growth: "نمو المبيعات",
            how_it_works: "كيف يعمل",
            claims_workbench: "منصة المطالبات",
            products: "المنتجات",
            claims: "المطالبات",
            about: "عن رمانة",
            login: "تسجيل الدخول",
            get_started: "ابدأ الآن",
        }
    },
    hero: {
        en: {
            title_part1: "Insurance Claims,",
            title_part2: "Reimagined.",
            description: "Experience the future of Saudi insurance. Report accidents, get instant AI assessments, and receive settlements in minutes, not days.",
            cta: "File a Claim Now",
            learn_more: "Learn More",
        },
        ar: {
            title_part1: "مطالبات التأمين،",
            title_part2: "برؤية جديدة.",
            description: "اختبر مستقبل التأمين السعودي. أبلغ عن الحوادث، واحصل على تقييمات فورية بالذكاء الاصطناعي، واستلم التسوية في دقائق، وليس أيام.",
            cta: "قدم مطالبة الآن",
            learn_more: "اعرف المزيد",
        }
    },
    features: {
        instant_ai: {
            en: { title: "Instant AI Service", description: "Our Claims Agents analyze damage in seconds using advanced computer vision." },
            ar: { title: "خدمة الذكاء الاصطناعي الفورية", description: "تقوم وكلاء المطالبات لدينا بتحليل الضرر في ثوانٍ باستخدام الرؤية الحاسوبية المتقدمة." }
        },
        ia_compliant: {
            en: { title: "IA Compliant", description: "Fully regulated by the Saudi Insurance Authority. Your rights are protected." },
            ar: { title: "متوافق مع هيئة التأمين", description: "منظم بالكامل من قبل هيئة التأمين السعودية. حقوقك محمية." }
        },
        paperless: {
            en: { title: "Paperless Process", description: "No more forms. Just chat with us and upload photos. We handle the rest." },
            ar: { title: "عملية بدون ورق", description: "لا مزيد من النماذج. فقط تحدث معنا وحمل الصور. نحن نتولى الباقي." }
        }
    },
    dashboard: {
        en: {
            priority_queue: "Priority Queue",
            evidence_log: "Evidence Log",
            mesh_insights: "Mesh Insights",
            decision_support: "Decision Support",
            select_claim: "Select A Claim",
            inspection_prompt: "Click a prioritized queue item to start AI inspection",
            vision_confidence: "Vision Confidence",
            fraud_correlation: "Fraud Correlation",
            clean: "CLEAN",
            auto_settlement: "Auto-Settlement Eligible",
        },
        ar: {
            priority_queue: "قائمة الأولويات",
            evidence_log: "سجل الأدلة",
            mesh_insights: "رؤى الشبكة",
            decision_support: "دعم القرار",
            select_claim: "اختر مطالبة",
            inspection_prompt: "انقر على عنصر في قائمة الأولويات لبدء فحص الذكاء الاصطناعي",
            vision_confidence: "ثقة الرؤية",
            fraud_correlation: "ارتباط الاحتيال",
            clean: "سليم",
            auto_settlement: "مؤهل للتسوية التلقائية",
        }
    },
    claims: {
        en: {
            new_claim: "New Claim",
            chat_prompt: "Hi! I'm your Rommaana Assistant. Please upload a photo of your vehicle damage to start your claim.",
            analyzing: "Analyzing image...",
            verifying_provenance: "Verifying image provenance...",
            checking_history: "Checking coverage and history...",
            finalizing: "Finalizing decision...",
            approved: "Approved",
            referred: "Referred to Human",
            damage_total_loss: "Total Loss Detected",
            damage_minor: "Minor Damage Detected",
        },
        ar: {
            new_claim: "مطالبة جديدة",
            chat_prompt: "مرحباً! أنا مساعد رمانة. يرجى تحميل صورة لتلف مركبتك لبدء مطالبتك.",
            analyzing: "جاري تحليل الصورة...",
            verifying_provenance: "التحقق من مصدر الصورة...",
            checking_history: "التحقق من التغطية والسجل...",
            finalizing: "جاري اتخاذ القرار النهائي...",
            approved: "تمت الموافقة",
            referred: "تمت الإحالة للمراجعة البشرية",
            damage_total_loss: "تم اكتشاف خسارة كلية",
            damage_minor: "تم اكتشاف تلف طفيف",
        }
    }
};
