import { Calendar, User, Shield } from "lucide-react";

interface MedicalDisclaimerProps {
  authorName?: string;
  lastUpdated?: Date;
  showAuthor?: boolean;
}

export default function MedicalDisclaimer({ 
  authorName = "Dr. Pratima Agale", 
  lastUpdated,
  showAuthor = true 
}: MedicalDisclaimerProps) {
  return (
    <div className="bg-sage-50 border border-sage-200 rounded-lg p-6 my-8">
      <div className="flex items-start gap-3 mb-4">
        <Shield className="w-5 h-5 text-sage-600 mt-0.5 flex-shrink-0" />
        <h3 className="text-lg font-semibold text-sage-900">Medical Disclaimer</h3>
      </div>
      
      <p className="text-sage-700 text-sm leading-relaxed mb-4">
        The information provided on this website is for educational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
      </p>
      
      <p className="text-sage-700 text-sm leading-relaxed mb-4">
        Homeopathic treatment may not be suitable for all conditions. Individual results may vary. In case of medical emergencies, please visit the nearest hospital or emergency services immediately.
      </p>

      {showAuthor && (
        <div className="border-t border-sage-200 pt-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-sage-600 mb-2">
            <User className="w-4 h-4" />
            <span className="font-medium">Author:</span>
            <span>{authorName}</span>
            <span className="text-sage-500">| BHMS, MD Homeopathy</span>
          </div>
          
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-sage-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Last Updated:</span>
              <span>{lastUpdated.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
