"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";


type Language = "English" | "Arabic" | "French";



interface LanguageContextType {

  language: Language;

  setLanguage: (lang: Language) => void;

  t: (key: string) => string;

}





const translations = {


  English: {

    dashboard: "Dashboard",
    calendar: "Calendar",
    tasks: "Tasks",
    shopping: "Shopping",
    notes: "Notes",
    interviews: "Interviews",
    settings: "Settings",
    logout: "Logout",
    welcome: "Welcome back",
    plan: "Plan today",
    quickActions: "Quick actions",
    addTask: "Add a task",
    writeNote: "Write a note",
    updateShopping: "Update shopping",
    dailyOverview:"Daily overview",
description:"You have tasks, notes, interviews, and events to manage today.",

quickDescription:"Jump into the things that matter most.",
taskDescription:"Keep your day on track.",
noteDescription:"Capture ideas quickly.",
shoppingDescription:"Stay ready for the week.",

taskPriority:"Your current priorities.",
noTasks:"No tasks yet.",

remainingItems:"Remaining items.",
needed:"Needed",
bought:"Bought",

recentNotes:"Recent notes",
latestIdeas:"Latest ideas.",
noNotes:"No notes yet.",

loadingTasks:"Loading tasks...",
loadingShopping:"Loading shopping items...",
loadingNotes:"Loading notes...",

done:"Done",
pending:"Pending",
totalTasks:"Total tasks",
upcomingEvents:"Upcoming events",
itemsRemaining:"Items remaining",
applications:"Applications",
upcoming:"Upcoming",
yourNextItems:"Your next items",
interview:"Interview",
  },



  Arabic: {

    dashboard: "لوحة التحكم",
    calendar: "التقويم",
    tasks: "المهام",
    shopping: "التسوق",
    notes: "الملاحظات",
    interviews: "المقابلات",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    welcome: "مرحبا",
    plan: "خطط ليومك",
    quickActions: "إجراءات سريعة",
    addTask: "إضافة مهمة",
    writeNote: "كتابة ملاحظة",
    updateShopping: "تحديث التسوق",
dailyOverview:"النظرة اليومية",
description:"لديك مهام وملاحظات ومقابلات وأحداث لإدارتها اليوم.",

quickDescription:"انتقل بسرعة إلى الأشياء المهمة.",
taskDescription:"حافظ على تنظيم يومك.",
noteDescription:"سجل أفكارك بسرعة.",
shoppingDescription:"ابق مستعداً للأسبوع.",

taskPriority:"أولوياتك الحالية.",
noTasks:"لا توجد مهام بعد.",

remainingItems:"العناصر المتبقية.",
needed:"مطلوب",
bought:"تم الشراء",

recentNotes:"الملاحظات الأخيرة",
latestIdeas:"أحدث الأفكار.",
noNotes:"لا توجد ملاحظات بعد.",

loadingTasks:"جاري تحميل المهام...",
loadingShopping:"جاري تحميل عناصر التسوق...",
loadingNotes:"جاري تحميل الملاحظات...",

done:"مكتمل",
pending:"قيد الانتظار",
totalTasks:"إجمالي المهام",
upcomingEvents:"الأحداث القادمة",
itemsRemaining:"العناصر المتبقية",
applications:"الطلبات",
upcoming:"القادم",
yourNextItems:"العناصر القادمة",
interview:"مقابلة",
  },



  French: {

    dashboard: "Tableau de bord",
    calendar: "Calendrier",
    tasks: "Tâches",
    shopping: "Achats",
    notes: "Notes",
    interviews: "Entretiens",
    settings: "Paramètres",
    logout: "Déconnexion",
    welcome: "Bienvenue",
    plan: "Planifier aujourd'hui",
    quickActions: "Actions rapides",
    addTask: "Ajouter une tâche",
    writeNote: "Écrire une note",
    updateShopping: "Mettre à jour les achats",
dailyOverview:"Aperçu quotidien",
description:"Vous avez des tâches, notes, entretiens et événements à gérer aujourd'hui.",

quickDescription:"Accédez rapidement aux choses importantes.",
taskDescription:"Gardez votre journée organisée.",
noteDescription:"Capturez vos idées rapidement.",
shoppingDescription:"Restez prêt pour la semaine.",

taskPriority:"Vos priorités actuelles.",
noTasks:"Aucune tâche pour le moment.",

remainingItems:"Articles restants.",
needed:"Nécessaire",
bought:"Acheté",

recentNotes:"Notes récentes",
latestIdeas:"Dernières idées.",
noNotes:"Aucune note pour le moment.",

loadingTasks:"Chargement des tâches...",
loadingShopping:"Chargement des articles...",
loadingNotes:"Chargement des notes...",

done:"Terminé",
pending:"En attente",
totalTasks:"Total des tâches",
upcomingEvents:"Événements à venir",
itemsRemaining:"Articles restants",
applications:"Candidatures",
upcoming:"À venir",
yourNextItems:"Vos prochains éléments",
interview:"Entretien",
  },


};







const LanguageContext =
  createContext<LanguageContextType | null>(null);








export function LanguageProvider({

  children,

}: {

  children: ReactNode;

}) {



  const [language, setLanguageState] =
    useState<Language>("English");







  useEffect(() => {


    const saved =
      localStorage.getItem("language");



    if (
      saved === "English" ||
      saved === "Arabic" ||
      saved === "French"
    ) {

      setLanguageState(saved);

    }


  }, []);








  function setLanguage(lang: Language) {


    setLanguageState(lang);


    localStorage.setItem(
      "language",
      lang
    );


  }








  function t(key: string) {


    return (
      translations[language][key as keyof typeof translations.English]
      ||
      key
    );


  }








  return (

    <LanguageContext.Provider

      value={{
        language,
        setLanguage,
        t,
      }}

    >

      {children}

    </LanguageContext.Provider>

  );


}








export function useLanguage() {


  const context =
    useContext(LanguageContext);



  if (!context) {

    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );

  }



  return context;


}