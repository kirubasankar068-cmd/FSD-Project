import { useState } from 'react';
import { Building2 } from 'lucide-react';

export default function SafeImage({ src, alt, className, companyName = "Company", fallbackSize = 20 }) {
    const [error, setError] = useState(false);

    const safeCompanyName = typeof companyName === 'object' ? (companyName.companyName || companyName.name || "Company") : (String(companyName || "Company"));

    if (!src || error) {
        // Generate a deterministic color based on company name
        const colors = [
            'bg-orange-100 text-orange-600',
            'bg-blue-100 text-blue-600',
            'bg-emerald-100 text-emerald-600',
            'bg-purple-100 text-purple-600',
            'bg-rose-100 text-rose-600',
            'bg-indigo-100 text-indigo-600'
        ];
        const colorIndex = safeCompanyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        const colorClass = colors[colorIndex];
        const initial = safeCompanyName.charAt(0).toUpperCase();

        return (
            <div className={`${className} ${colorClass} flex items-center justify-center font-black text-sm select-none`}>
                {initial || <Building2 size={fallbackSize} />}
            </div>
        );
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className={className} 
            onError={() => {
                console.warn(`[SafeImage] Transmission failure for: ${src}. Activating initials fallback.`);
                setError(true);
            }}
            loading="lazy"
            referrerPolicy="no-referrer" // Helps with some tracking prevention blocks
        />
    );
}
