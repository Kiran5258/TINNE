import React from 'react';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Plus,
  Upload,
  LogOut,
  MapPin,
  Box,
  Leaf,
  ShieldCheck,
  Globe,
  Award,
  Heart,
  BookOpen,
  Feather,
  Trash2,
  Minus,
  Check,
  AlertCircle,
  Star,
  MessageCircle,
  CornerDownRight,
  Edit2,
  TrendingUp,
  DollarSign,
  BarChart3,
  FlaskConical,
  Utensils,
  Truck,
  Users,
  Clock,
  Calendar,
  Share2,
  ArrowLeft,
  Package
} from 'lucide-react';

export const IconBag = ({ className }: { className?: string }) => <ShoppingBag className={className} />;
export const IconUser = ({ className }: { className?: string }) => <User className={className} />;
export const IconSearch = ({ className }: { className?: string }) => <Search className={className} />;
export const IconMenu = ({ className }: { className?: string }) => <Menu className={className} />;
export const IconClose = ({ className }: { className?: string }) => <X className={className} />;
export const IconChevronRight = ({ className }: { className?: string }) => <ChevronRight className={className} />;
export const IconChevronLeft = ({ className }: { className?: string }) => <ChevronLeft className={className} />;
export const IconArrowRight = ({ className }: { className?: string }) => <ArrowRight className={className} />;
export const IconPlus = ({ className }: { className?: string }) => <Plus className={className} />;
export const IconUpload = ({ className }: { className?: string }) => <Upload className={className} />;
export const IconLogout = ({ className }: { className?: string }) => <LogOut className={className} />;
export const IconMapPin = ({ className }: { className?: string }) => <MapPin className={className} />;
export const IconBox = ({ className }: { className?: string }) => <Box className={className} />;
export const IconLeaf = ({ className }: { className?: string }) => <Leaf className={className} />;
export const IconShieldCheck = ({ className }: { className?: string }) => <ShieldCheck className={className} />;
export const IconGlobe = ({ className }: { className?: string }) => <Globe className={className} />;
export const IconAward = ({ className }: { className?: string }) => <Award className={className} />;
export const IconHeart = ({ className }: { className?: string }) => <Heart className={className} />;
export const IconBookOpen = ({ className }: { className?: string }) => <BookOpen className={className} />;
export const IconFeather = ({ className }: { className?: string }) => <Feather className={className} />;
export const IconTrash = ({ className }: { className?: string }) => <Trash2 className={className} />;
export const IconMinus = ({ className }: { className?: string }) => <Minus className={className} />;
export const IconCheck = ({ className }: { className?: string }) => <Check className={className} />;
export const IconAlertCircle = ({ className }: { className?: string }) => <AlertCircle className={className} />;
export const IconStar: React.FC<{ className?: string; fill?: boolean }> = ({ className, fill }) => <Star className={className} fill={fill ? "currentColor" : "none"} />;
export const IconMessageCircle = ({ className }: { className?: string }) => <MessageCircle className={className} />;
export const IconCornerDownRight = ({ className }: { className?: string }) => <CornerDownRight className={className} />;
export const IconEdit = ({ className }: { className?: string }) => <Edit2 className={className} />;
export const IconTrendingUp = ({ className }: { className?: string }) => <TrendingUp className={className} />;
export const IconDollarSign = ({ className }: { className?: string }) => <DollarSign className={className} />;
export const IconBarChart = ({ className }: { className?: string }) => <BarChart3 className={className} />;
export const IconScience = ({ className }: { className?: string }) => <FlaskConical className={className} />;
export const IconUtensils = ({ className }: { className?: string }) => <Utensils className={className} />;
export const IconTruck = ({ className }: { className?: string }) => <Truck className={className} />;
export const IconUsers = ({ className }: { className?: string }) => <Users className={className} />;
export const IconClock = ({ className }: { className?: string }) => <Clock className={className} />;
export const IconCalendar = ({ className }: { className?: string }) => <Calendar className={className} />;
export const IconShare2 = ({ className }: { className?: string }) => <Share2 className={className} />;
export const IconArrowLeft = ({ className }: { className?: string }) => <ArrowLeft className={className} />;
export const IconPackage = ({ className }: { className?: string }) => (<Package className={className} />);
export const IconCancel = ({ className }: { className?: string }) => (<X className={className} />);
export const IconSettings = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);