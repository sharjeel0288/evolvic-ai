import { createElement } from "react";
import {
  Workflow, PhoneCall, MessagesSquare, Contact, Bot, Globe, BarChart3, PhoneMissed, CalendarCheck, Filter, LifeBuoy,
  DatabaseZap, LineChart, Compass, Users, Network, RefreshCw, Ear, Link2, UserCheck, Wrench, Lightbulb, Cpu, Code2,
  PieChart, FileText, ShoppingBag, Search, Stethoscope, Home, Hammer, Hotel, Plane, GraduationCap, Briefcase, Megaphone,
  Puzzle, Plug, ShieldCheck, Sparkles, type LucideIcon,
} from "lucide-react";

/** Title → lucide icon. Unknown titles fall back to Sparkles. */
const MAP: Record<string, LucideIcon> = {
  "workflow-automation": Workflow, "voice-agents": PhoneCall, chatbots: MessagesSquare, "crm-automation": Contact,
  "custom-ai": Bot, "ai-websites": Globe, analytics: BarChart3,
  "Missed calls": PhoneMissed, "Appointment booking": CalendarCheck, "Lead qualification": Filter, "Customer support": LifeBuoy,
  "CRM updates": DatabaseZap, Reporting: LineChart,
  "Custom-Built": Puzzle, Connected: Plug, "Human-First": ShieldCheck,
  "Your process comes first.": Compass, "People stay in control.": UserCheck, "Connections matter.": Network, "Improvement is part of the plan.": RefreshCw,
  "We listen before we build.": Ear, "We connect, rather than complicate.": Link2, "We build for real users.": Users, "We keep improving.": RefreshCw,
  "AI strategy": Lightbulb, "AI engineering": Cpu, "Software & web development": Code2, "Data & analytics": PieChart,
  "Capture after-hours calls": PhoneMissed, "Qualify new leads": Filter, "Coordinate appointments": CalendarCheck,
  "Answer recurring customer questions": LifeBuoy, "Follow up with inquiries": RefreshCw, "Process incoming documents": FileText,
  "Automate CRM data updates": DatabaseZap, "Help online shoppers find products": ShoppingBag, "Support internal teams with knowledge search": Search,
  "Simplify business reporting": LineChart,
  "Healthcare & Wellness": Stethoscope, "Real Estate & Property": Home, "Home & Field Services": Hammer, "eCommerce & Retail": ShoppingBag,
  "Hospitality & Restaurants": Hotel, "Travel & Tourism": Plane, "Education & Training": GraduationCap, "Professional Services": Briefcase,
  "Agencies & B2B Services": Megaphone, Products: Sparkles, About: Users, Wrench: Wrench,
};

export function iconFor(key: string): LucideIcon { return MAP[key] ?? Sparkles; }

export function IconTile({ k, size = 20, className = "" }: { k: string; size?: number; className?: string }) {
  return <span className={`icon-tile ${className}`} aria-hidden>{createElement(iconFor(k), { size, strokeWidth: 1.6 })}</span>;
}
