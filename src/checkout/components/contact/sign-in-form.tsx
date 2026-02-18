"use client";

import { type FC, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { useRequestPasswordResetMutation } from "@/checkout/graphql";

export interface SignInFormProps {
	/** Pre-filled email address */
	initialEmail?: string;
	/** Saleor channel slug for password reset */
	channelSlug: string;
	/** Called when sign-in is successful */
	onSuccess: () => void;
	/** Called when user wants to checkout as guest */
	onGuestCheckout: () => void;
}

/**
 * Sign-in form with email, password, and forgot password functionality.
 *
 * Features:
 * - Email/password authentication via Saleor
 * - Password visibility toggle
 * - Forgot password flow with rate limit messaging
 * - "Guest checkout" option
 */
export const SignInForm: FC<SignInFormProps> = ({
	initialEmail = "",
	channelSlug,
	onSuccess,
	onGuestCheckout,
}) => {
	const { signIn } = useSaleorAuthContext();
	const [, requestPasswordReset] = useRequestPasswordResetMutation();
	const [email, setEmail] = useState(initialEmail);
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [passwordResetSent, setPasswordResetSent] = useState(false);

	const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");
		setIsSubmitting(true);

		try {
			const result = await signIn({ email, password });
			if (result.data?.tokenCreate?.errors?.length) {
				const err = result.data.tokenCreate.errors[0];
				setError(err.message || "Correo o contraseña inválidos");
			} else if (result.data?.tokenCreate?.token) {
				onSuccess();
			} else {
				setError("Error al iniciar sesión. Por favor intenta de nuevo.");
			}
		} catch {
			setError("Ocurrió un error. Por favor intenta de nuevo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleForgotPassword = async () => {
		setError("");
		setSuccessMessage("");

		if (!email) {
			setError("Por favor ingresa tu correo electrónico primero");
			return;
		}

		if (!validateEmail(email)) {
			setError("Por favor ingresa un correo electrónico válido");
			return;
		}

		setIsSubmitting(true);
		try {
			const result = await requestPasswordReset({
				email,
				channel: channelSlug,
				redirectUrl: window.location.href,
			});

			if (result.error) {
				setError(result.error.message || "Error al enviar el enlace de restablecimiento");
				return;
			}

			if (result.data?.requestPasswordReset?.errors?.length) {
				const err = result.data.requestPasswordReset.errors[0];
				setError(err.message || "Error al enviar el enlace de restablecimiento");
			} else {
				setPasswordResetSent(true);
				setSuccessMessage(
					`Si existe una cuenta para ${email}, se ha enviado un enlace de restablecimiento. ` +
						`Nota: Solo puedes solicitar un enlace de restablecimiento cada 15 minutos.`,
				);
			}
		} catch {
			setError("Ocurrió un error. Por favor intenta de nuevo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">Iniciar sesión</h2>
				<p className="text-sm text-muted-foreground">
					¿Cliente nuevo?{" "}
					<button
						type="button"
						onClick={onGuestCheckout}
						className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
					>
						Comprar como invitado
					</button>
				</p>
			</div>

			{error && <div className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">{error}</div>}

			{successMessage && (
				<div className="rounded-md bg-green-100 p-3 text-sm text-green-800">{successMessage}</div>
			)}

			<div className="space-y-1.5">
				<div className="relative">
					<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="email"
						placeholder="Correo electrónico"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setPasswordResetSent(false);
						}}
						autoComplete="email"
						className="h-12 pl-10"
						required
					/>
				</div>
			</div>

			<div className="space-y-1.5">
				<div className="relative">
					<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type={showPassword ? "text" : "password"}
						placeholder="Contraseña"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="current-password"
						className="h-12 pl-10 pr-10"
						required
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					>
						{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={handleForgotPassword}
					disabled={isSubmitting}
					className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline disabled:opacity-50"
				>
					{passwordResetSent ? "¿Reenviar enlace?" : "¿Olvidaste tu contraseña?"}
				</button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Procesando..." : "Iniciar sesión"}
				</Button>
			</div>
		</form>
	);
};
