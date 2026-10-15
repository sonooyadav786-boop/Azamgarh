import React from 'react';
import { Calendar, Trash2, AlertCircle, Check, X } from 'lucide-react';
import { CalendarEvent } from '../types/calendar';

export interface CalendarConfirmModalProps {
  isOpen: boolean;
  type: 'sync_single' | 'sync_bulk' | 'delete_single';
  event?: CalendarEvent | null;
  eventsList?: CalendarEvent[];
  userEmail?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CalendarConfirmModal: React.FC<CalendarConfirmModalProps> = ({
  isOpen,
  type,
  event,
  eventsList = [],
  userEmail,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const isDelete = type === 'delete_single';
  const isBulk = type === 'sync_bulk';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => !isLoading && onCancel()}
      />

      {/* Modal Card */}
      <div className="relative bg-[#fffdfa] w-full max-w-md rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden my-auto p-5 sm:p-6 text-stone-900 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
              isDelete ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}
          >
            {isDelete ? (
              <Trash2 className="w-5 h-5" />
            ) : (
              <Calendar className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-stone-900">
              {isDelete
                ? 'Google Calendar से अनुस्मारक हटाएं?'
                : isBulk
                ? `${eventsList.length} त्यौहार Google Calendar में सिंक करें?`
                : 'Google Calendar में अनुस्मारक जोड़ें?'}
            </h3>

            {userEmail && (
              <p className="text-xs text-blue-800 font-medium mt-0.5">
                खाता: <span className="font-semibold">{userEmail}</span>
              </p>
            )}
          </div>

          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Description */}
        <div className="mt-4 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs sm:text-sm text-stone-700 space-y-2">
          {isDelete ? (
            <p>
              क्या आप सुनिश्चित हैं कि आप{' '}
              <strong className="text-red-900 font-bold">
                &ldquo;{event?.titleHindi || 'इस त्यौहार'}&rdquo;
              </strong>{' '}
              का रिमाइंडर अपने Google Calendar से हटाना चाहते हैं? यह क्रिया आपके
              व्यक्तिगत कैलेंडर से इस इवेंट को हटा देगी।
            </p>
          ) : isBulk ? (
            <div>
              <p className="mb-2 font-medium">
                निम्नलिखित <strong>{eventsList.length}</strong> त्यौहारों के लिए
                तारीख, पंचांग, शुभ मुहूर्त और 1 दिन पूर्व का अलार्म आपके Google Calendar
                में जोड़ा जाएगा:
              </p>
              <div className="max-h-36 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                {eventsList.slice(0, 10).map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between bg-white px-2.5 py-1 rounded border border-amber-200/60 text-xs"
                  >
                    <span className="font-semibold text-stone-800">
                      🚩 {ev.titleHindi}
                    </span>
                    <span className="text-stone-500 font-mono text-[11px]">
                      {ev.day}/{ev.month}/{ev.year}
                    </span>
                  </div>
                ))}
                {eventsList.length > 10 && (
                  <p className="text-[11px] text-stone-500 italic text-center pt-1">
                    ...एवं {eventsList.length - 10} अन्य पावन पर्व
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p>
                त्यौहार:{' '}
                <strong className="text-red-950 font-bold text-sm">
                  {event?.titleHindi} ({event?.titleEng})
                </strong>
              </p>
              <p className="text-stone-600">
                दिनांक: <strong>{event?.fullDateHindi}</strong> ({event?.hinduMonth}{' '}
                मास, {event?.tithi})
              </p>
              {event?.muhuratTime && (
                <p className="text-amber-800 font-medium">
                  शुभ मुहूर्त: {event.muhuratTime}
                </p>
              )}
              <div className="pt-1.5 text-[11px] text-stone-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  इस इवेंट के साथ 1 दिन पूर्व और 3 घंटे पूर्व का ऑटोमैटिक नोटिफिकेशन
                  अलार्म सेट होगा।
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            रद्द करें (Cancel)
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs sm:text-sm font-bold text-white rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              isDelete
                ? 'bg-red-700 hover:bg-red-800'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>प्रक्रिया जारी है...</span>
              </>
            ) : isDelete ? (
              <>
                <Trash2 className="w-4 h-4" />
                <span>हाँ, कैलेंडर से हटाएं</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>हाँ, सिंक करें (Confirm)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
