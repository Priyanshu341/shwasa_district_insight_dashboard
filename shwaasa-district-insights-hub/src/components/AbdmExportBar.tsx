
import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { Download, AlertTriangle, RefreshCcw, Mail, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import logo from '../components/assets/logo_transparent_background.png';

// Format the current date and time (Saturday, May 31, 2025, 12:50 PM IST)
const formatDateTime = (date: Date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format
  return `${dayName}, ${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
};

const currentDateTime = formatDateTime(new Date('2025-05-31T12:50:00+05:30')); // 12:50 PM IST on May 31, 2025

const AbdmExportBar = () => {
  const { toast } = useToast();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleExport = async () => {
    toast({
      title: 'Exporting Dashboard',
      description: 'Generating high-quality PDF...',
    });

    try {
      const dashboardContent = document.querySelector('main') || document.body;

      if (!dashboardContent) {
        throw new Error('Dashboard content not found');
      }

      dashboardContent.classList.add('export-pdf-mode');

      const style = document.createElement('style');
      style.id = 'export-pdf-style';
      style.innerHTML = `
        .export-pdf-mode {
          background-color: #ffffff !important;
          color: #000000 !important;
        }

        .export-pdf-mode * {
          color: #000000 !important;
          background: transparent !important;
          border-color: #000000 !important;
        }

        .export-pdf-mode .bg-muted,
        .export-pdf-mode .text-muted-foreground {
          color: #333333 !important;
        }

        .export-pdf-mode img,
        .export-pdf-mode svg {
          filter: contrast(120%) brightness(110%);
        }
      `;
      document.head.appendChild(style);

      const opt = {
        margin: 0.5,
        filename: 'Telangana_Dashboard.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: {
          scale: 4,
          useCORS: true,
          backgroundColor: '#ffffff',
          allowTaint: true,
          logging: false,
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'landscape',
        },
      };

      await html2pdf().set(opt).from(dashboardContent).save();

      dashboardContent.classList.remove('export-pdf-mode');
      document.getElementById('export-pdf-style')?.remove();

      toast({
        title: 'Download Started',
        description: 'The dashboard is downloading as a high-contrast PDF.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error.message || 'PDF generation error.',
        variant: 'destructive',
      });
      console.error('PDF Export Error:', error);
    }
  };

  const handleSync = () => {
    toast({
      title: 'Dashboard Sync Started',
      description: 'Synchronizing with State dashboard...',
    });

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleReport = () => {
    setIsContactModalOpen(true);
  };

  const closeModal = () => {
    setIsContactModalOpen(false);
  };

  return (
    <>
      <div className="bg-background/80 backdrop-blur-md border-t py-3 px-6 w-full flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-md"></div>
          <p className="text-sm font-medium">System Status: Online</p>
          <p className="text-xs text-muted-foreground">Last sync: {currentDateTime}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 bg-background/50 backdrop-blur-sm hover:bg-primary/10"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download high-contrast PDF of the dashboard</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
{/*               <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 bg-background/50 backdrop-blur-sm hover:bg-primary/10"
                onClick={handleSync}
              >
                <RefreshCcw className="h-4 w-4" />
                Sync with State Dashboard
              </Button> */}
            </TooltipTrigger>
            <TooltipContent>Push latest data to State Health Dashboard</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 bg-background/50 backdrop-blur-sm hover:bg-primary/10"
                onClick={handleReport}
              >
                <AlertTriangle className="h-4 w-4" />
                Report Issue
              </Button>
            </TooltipTrigger>
            <TooltipContent>Report technical or data issues</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-background rounded-lg shadow-2xl p-10 w-full max-w-3xl min-h-[80vh] relative my-10">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4"
              onClick={closeModal}
            >
              <X className="h-8 w-8 text-foreground" />
            </Button>

            <div className="flex justify-center mb-8">
              <img
                src={logo}
                alt="SETV Global Logo"
                className="h-20 w-auto object-contain"
              />
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-foreground text-center">Contact Us</h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                We are here to assist you with any technical or data-related issues. Whether you have questions, need support, or want to provide feedback, feel free to reach out to us using the contact details below.
              </p>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground">Reach Us</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <Mail className="h-7 w-7 text-primary mt-1" />
                    <div>
                      <p className="text-xl font-medium text-foreground">Email Us</p>
                      <a
                        href="mailto:hr.communications@setvglobal.com"
                        className="text-primary hover:underline text-lg"
                      >
                        hr.communications@setvglobal.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="h-7 w-7 text-primary mt-1" />
                    <div>
                      <p className="text-xl font-medium text-foreground">Operational Address</p>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        SETV.ASRV LLP, Avishkaran, NIPER, Balanagar, Hyderabad, Telangana, 500037
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  At SETV Global, we are committed to providing exceptional support and ensuring your experience with our platform is seamless. Our team is available to address any concerns you may have. Reach out to us, and we'll get back to you as soon as possible.
                </p>
              </div>

              <div className="mt-10 flex justify-center">
                <Button onClick={closeModal} className="px-8 py-3 text-lg">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AbdmExportBar;
