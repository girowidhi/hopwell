"use client";

import * as React from "react";
import { Phone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Common countries with their codes (unique by code)
const COUNTRIES = [
  { code: "+1", name: "US/CA", flag: "🇺🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+254", name: "KE", flag: "🇰🇪" },
  { code: "+255", name: "TZ", flag: "🇹🇿" },
  { code: "+256", name: "UG", flag: "🇺🇬" },
  { code: "+257", name: "BI", flag: "🇧🇮" },
  { code: "+258", name: "MZ", flag: "🇲🇿" },
  { code: "+260", name: "ZM", flag: "🇿🇲" },
  { code: "+263", name: "ZW", flag: "🇿🇼" },
  { code: "+27", name: "ZA", flag: "🇿🇦" },
  { code: "+234", name: "NG", flag: "🇳🇬" },
  { code: "+233", name: "GH", flag: "🇬🇭" },
  { code: "+225", name: "CI", flag: "🇨🇮" },
  { code: "+221", name: "SN", flag: "🇸🇳" },
  { code: "+20", name: "EG", flag: "🇪🇬" },
  { code: "+212", name: "MA", flag: "🇲🇦" },
  { code: "+216", name: "TN", flag: "🇹🇳" },
  { code: "+213", name: "DZ", flag: "🇩🇿" },
  { code: "+249", name: "SD", flag: "🇸🇩" },
  { code: "+251", name: "ET", flag: "🇪🇹" },
  { code: "+252", name: "SO", flag: "🇸🇴" },
  { code: "+91", name: "IN", flag: "🇮🇳" },
  { code: "+86", name: "CN", flag: "🇨🇳" },
  { code: "+81", name: "JP", flag: "🇯🇵" },
  { code: "+82", name: "KR", flag: "🇰🇷" },
  { code: "+61", name: "AU", flag: "🇦🇺" },
  { code: "+64", name: "NZ", flag: "🇳🇿" },
  { code: "+55", name: "BR", flag: "🇧🇷" },
  { code: "+54", name: "AR", flag: "🇦🇷" },
  { code: "+52", name: "MX", flag: "🇲🇽" },
  { code: "+353", name: "IE", flag: "🇮🇪" },
  { code: "+33", name: "FR", flag: "🇫🇷" },
  { code: "+49", name: "DE", flag: "🇩🇪" },
  { code: "+31", name: "NL", flag: "🇳🇱" },
  { code: "+32", name: "BE", flag: "🇧🇪" },
  { code: "+34", name: "ES", flag: "🇪🇸" },
  { code: "+39", name: "IT", flag: "🇮🇹" },
  { code: "+46", name: "SE", flag: "🇸🇪" },
  { code: "+47", name: "NO", flag: "🇳🇴" },
  { code: "+45", name: "DK", flag: "🇩🇰" },
  { code: "+358", name: "FI", flag: "🇫🇮" },
  { code: "+372", name: "EE", flag: "🇪🇪" },
  { code: "+370", name: "LT", flag: "🇱🇹" },
  { code: "+371", name: "LV", flag: "🇱🇻" },
  { code: "+48", name: "PL", flag: "🇵🇱" },
  { code: "+420", name: "CZ", flag: "🇨🇿" },
  { code: "+36", name: "HU", flag: "🇭🇺" },
  { code: "+30", name: "GR", flag: "🇬🇷" },
  { code: "+90", name: "TR", flag: "🇹🇷" },
  { code: "+971", name: "AE", flag: "🇦🇪" },
  { code: "+973", name: "BH", flag: "🇧🇭" },
  { code: "+965", name: "KW", flag: "🇰🇼" },
  { code: "+968", name: "OM", flag: "🇴🇲" },
  { code: "+974", name: "QA", flag: "🇶🇦" },
  { code: "+966", name: "SA", flag: "🇸🇦" },
];

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  defaultCountry?: string;
  error?: boolean;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, defaultCountry = "+254", error, ...props }, ref) => {
    const [countryCode, setCountryCode] = React.useState(defaultCountry);
    const [phoneNumber, setPhoneNumber] = React.useState("");

    // Parse initial value if provided
    React.useEffect(() => {
      if (value) {
        // Try to extract country code from value
        const matchedCountry = COUNTRIES.find((c) => value.startsWith(c.code));
        if (matchedCountry) {
          setCountryCode(matchedCountry.code);
          setPhoneNumber(value.slice(matchedCountry.code.length));
        } else {
          setPhoneNumber(value);
        }
      }
    }, []);

    const handleCountryChange = (newCode: string) => {
      setCountryCode(newCode);
      const fullPhone = newCode + phoneNumber;
      onChange?.(fullPhone);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Only allow digits and common phone characters
      const cleaned = e.target.value.replace(/[^\d\s\-()+]/g, "");
      setPhoneNumber(cleaned);
      const fullPhone = countryCode + cleaned;
      onChange?.(fullPhone);
    };

    return (
      <div className="flex items-center gap-2">
        <Select value={countryCode} onValueChange={handleCountryChange}>
          <SelectTrigger
            className={cn(
              "w-[100px] bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white focus:border-[#C9A87C] focus:ring-[#C9A87C]/20",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            )}
          >
            <SelectValue placeholder="Code">
              <div className="flex items-center gap-1">
                {COUNTRIES.find((c) => c.code === countryCode)?.flag || "🌍"}
                <span className="text-sm">{countryCode}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-[#0F1525] border-[#C9A87C]/20 max-h-[300px]">
            {COUNTRIES.map((country) => (
              <SelectItem
                key={country.code}
                value={country.code}
                className="text-white focus:bg-[#C9A87C]/20 focus:text-white cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.code}</span>
                  <span className="text-gray-400 text-sm">({country.name})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Input
            ref={ref}
            type="tel"
            placeholder="712345678"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={cn(
              "bg-[#0A0F1E]/50 border-[#C9A87C]/20 text-white placeholder:text-gray-500 focus:border-[#C9A87C] focus:ring-[#C9A87C]/20 transition-all duration-200 pl-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            )}
            {...props}
          />
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput, COUNTRIES };
