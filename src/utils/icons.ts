// Lucide icons — locally bundled, tree-shaken
import { createIcons } from 'lucide';
import {
  AlertTriangle, BadgeCheck, Briefcase, Building2, Calculator,
  CalendarClock, Check, CheckCircle, ChevronDown, Copy,
  Download, Edit, ExternalLink, FileText, Globe,
  GraduationCap, Heart, HelpCircle, Info, Lock,
  Mail, MapPin, Monitor, Moon, Receipt,
  Share2, ShieldCheck, Sparkles, Stamp, Sun,
  UserCheck, Users, Wallet, Wrench, X,
} from 'lucide';

// Register all icons used in the app
const icons = {
  'alert-triangle': AlertTriangle, 'badge-check': BadgeCheck, 'briefcase': Briefcase,
  'building-2': Building2, 'calculator': Calculator, 'calendar-clock': CalendarClock,
  'check': Check, 'check-circle': CheckCircle, 'chevron-down': ChevronDown,
  'copy': Copy, 'download': Download, 'edit': Edit,
  'external-link': ExternalLink, 'file-text': FileText, 'globe': Globe,
  'graduation-cap': GraduationCap, 'heart': Heart, 'help-circle': HelpCircle,
  'info': Info, 'lock': Lock, 'mail': Mail,
  'map-pin': MapPin, 'monitor': Monitor, 'moon': Moon,
  'receipt': Receipt, 'share-2': Share2, 'shield-check': ShieldCheck,
  'sparkles': Sparkles, 'stamp': Stamp, 'sun': Sun,
  'user-check': UserCheck, 'users': Users, 'wallet': Wallet,
  'wrench': Wrench, 'x': X,
};

let pendingInit: ReturnType<typeof setTimeout> | null = null;

export function initIcons(): void {
  if (pendingInit) clearTimeout(pendingInit);
  pendingInit = setTimeout(() => {
    createIcons({ icons });
    pendingInit = null;
  }, 10);
}
