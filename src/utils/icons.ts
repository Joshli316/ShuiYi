// Lucide icons — tree-shaken (only icons used in the app)
import {
  createIcons,
  AlertTriangle, BadgeCheck, Briefcase, Building2, Calculator,
  CalendarClock, Check, CheckCircle, ChevronDown, Copy,
  Download, Edit, ExternalLink, FileText, Globe,
  GraduationCap, Heart, HelpCircle, Info, Lock,
  Mail, MapPin, Monitor, Moon, Receipt,
  Share2, ShieldCheck, Sparkles, Stamp, Sun,
  UserCheck, Users, Wallet, Wrench, X,
} from 'lucide';

let pendingInit: ReturnType<typeof setTimeout> | null = null;

export function initIcons(): void {
  if (pendingInit) clearTimeout(pendingInit);
  pendingInit = setTimeout(() => {
    createIcons({
      icons: {
        AlertTriangle, BadgeCheck, Briefcase, Building2, Calculator,
        CalendarClock, Check, CheckCircle, ChevronDown, Copy,
        Download, Edit, ExternalLink, FileText, Globe,
        GraduationCap, Heart, HelpCircle, Info, Lock,
        Mail, MapPin, Monitor, Moon, Receipt,
        Share2, ShieldCheck, Sparkles, Stamp, Sun,
        UserCheck, Users, Wallet, Wrench, X,
      },
    });
    pendingInit = null;
  }, 10);
}
