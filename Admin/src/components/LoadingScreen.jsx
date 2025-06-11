import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
            <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen; 