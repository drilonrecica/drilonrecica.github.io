import { useState, useRef, useEffect } from 'react';

interface ProjectTitleLinkProps {
    title: string;
    projectUrl: string;
    colorClass?: string;
}

export function ProjectTitleLink({ title, projectUrl, colorClass = 'text-blue-400' }: ProjectTitleLinkProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (isDialogOpen && dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, [isDialogOpen]);

    const handleClick = () => {
        setIsDialogOpen(true);
    };

    const handleConfirm = () => {
        window.open(projectUrl, '_blank', 'noopener,noreferrer');
        closeDialog();
    };

    const handleCancel = () => {
        closeDialog();
    };

    const closeDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        setIsDialogOpen(false);
    };

    return (
        <>
            <button
                onClick={handleClick}
                className={`text-xl font-bold text-white group-hover:${colorClass} transition-colors cursor-pointer hover:underline decoration-2 underline-offset-4 text-left`}
            >
                {title}
            </button>

            {isDialogOpen && (
                <dialog
                    ref={dialogRef}
                    className="fixed z-50 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-0 shadow-2xl shadow-black/50 max-w-md w-[90vw] m-auto backdrop:bg-black/60"
                    onClose={closeDialog}
                    onClick={(e) => {
                        if (e.target === dialogRef.current) {
                            closeDialog();
                        }
                    }}
                >
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Visit Project Page?</h3>
                        <p className="text-slate-300 mb-6">
                            Would you like to visit the project page for <span className={colorClass}>{title}</span>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-5 py-2.5 rounded-xl font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                            >
                                No, thanks
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-5 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25"
                            >
                                Yes, visit
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
}
