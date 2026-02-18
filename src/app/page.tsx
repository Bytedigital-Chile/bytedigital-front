import { redirect } from "next/navigation";
import { DefaultChannelSlug } from "@/app/config";

/**
 * Root page redirects to the default channel.
 *
 * Requires NEXT_PUBLIC_DEFAULT_CHANNEL to be set.
 * In development, shows setup instructions if not configured.
 */
export default function RootPage() {
	if (DefaultChannelSlug) {
		redirect(`/${DefaultChannelSlug}`);
	}

	// No channel configured - show setup instructions
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-8">
			<div className="max-w-md text-center">
				<h1 className="mb-4 text-2xl font-semibold text-foreground">Canal no configurado</h1>
				<p className="mb-6 text-muted-foreground">
					Configura la variable de entorno <code className="rounded bg-muted px-2 py-1">NEXT_PUBLIC_DEFAULT_CHANNEL</code> con
					el slug de tu canal de Saleor.
				</p>
				<div className="rounded-lg bg-muted p-4 text-left">
					<p className="mb-2 text-sm font-medium text-foreground">En tu archivo .env.local:</p>
					<code className="text-sm text-muted-foreground">NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel</code>
				</div>
			</div>
		</div>
	);
}
