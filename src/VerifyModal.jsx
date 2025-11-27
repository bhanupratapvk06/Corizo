import React, { useEffect, useState } from "react";
import verifiedRound from "/verified_g.png";      // white circle with tick
import verifiedBadge from "/verified_green.png";  // green badge with tick
import loader from "/loader.gif";                 // loader gif

export default function VerifyModal({ open, onClose,recipientCode}) {
  // phase 0..7 (see mapping below)
  const [phase, setPhase] = useState(0);

  // rows that eventually appear
  const steps = [
    {
      label: "Recipient Name",
      value: recipientCode,
    },
    {
      label: "Issuer Name",
      value: "Corizo Edutech",
    },
    {
      label: "Credential Title",
      value: "Training Certificate Corizo",
    },
    {
      label: "Issuance Date",
      value: "17 October 2025",
    },
    {
      label: "Status",
      value: "Active, Not Expired",
    },
    {
      label: "Verified on Blockchain",
      value:
        "ca0eca56df5bda5fa3ee5bb9c13c915acbf5323ccbc843cfad966016bf2fa9ab08e9610c944ff053a7df1bbabafd94",
    },
  ];

  // loader messages indexed by phase
  const loaderMessages = [
    "Verifying...",
    "Verifying Issuer...",
    "Verifying Credential Title...",
    "Verifying Issuance Date...",
    "Verifying Status...",
    "Cross-Verifying on Blockchain...",
    "Finalizing...",
  ];

  useEffect(() => {
    if (!open) return;

    // restart animation when modal opens
    setPhase(0);

    const id = setInterval(() => {
      setPhase((prev) => {
        if (prev >= 7) {
          clearInterval(id);
          return prev;
        }
        return prev + 1;
      });
    }, 1000); // 1s between each step

    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  // how many rows to show for current phase
  const rowsToShow = Math.min(phase, steps.length); // at phase 0 -> 0, phase1->1...

  const showLoader = phase <= 6; // last loader text is "Finalizing..." at phase 6
  const loaderText = loaderMessages[Math.min(phase, loaderMessages.length - 1)];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.40)" }} // light grey overlay
      onClick={onClose} // click outside closes
    >
      <div
        className="bg-white rounded-xl shadow-xl w-[90%] max-w-[520px] px-6 py-6 md:px-8 md:py-8 transition-all duration-300"
        style={{ animation: "vm-grow 0.3s ease-out" }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* rows */}
        <div className="flex flex-col font-[Inter]">
          {steps.slice(0, rowsToShow).map((step, index) => (
            <div
              key={step.label}
              className="flex items-start gap-4 mb-7 vm-slide-row"
            >
              <img
                src={verifiedRound}
                alt="Verified"
                className="h-11 w-11 select-none"
              />
              <div className="max-w-full">
                {step.label != 'Status' ? <p className="text-[10px] font-semibold text-[#616161]">{step.label}</p> : ''}
                <p
                  className={`mt-1 ${
                    step.label === "Verified on Blockchain"
                      ? "text-[10px] leading-4 font-medium text-[#707070] break-all"
                      : "text-[16px] font-semibold text-[#707070]"
                  }`}
                >
                  {step.value}
                </p>
              </div>
            </div>
          ))}

          {/* loader under last visible row while verifying next (phase 0..6) */}
          {showLoader && (
            <div className="flex items-center gap-3 mt-2">
              <img
                src={loader}
                alt="Loading"
                className="h-7 w-7 select-none"
              />
              <p className="text-[14px] font-medium text-gray-600">
                {loaderText}
              </p>
            </div>
          )}

          {/* final Verified Credential row at phase 7 */}
          {phase >= 7 && (
            <div className="flex items-center gap-3 vm-slide-row">
              <img
                src={verifiedBadge}
                alt="Verified Credential"
                className="h-12 w-12 drop-shadow-md select-none"
              />
              <p className="text-[16px] font-medium font-[Inter] text-[#28c655]">
                Verified Credential
              </p>
            </div>
          )}
        </div>
      </div>

      {/* inline keyframes for slide + grow */}
      <style>{`
        @keyframes vm-grow {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes vm-slideIn {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .vm-slide-row {
          animation: vm-slideIn 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}
