"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";

type FormMode = "login" | "setPassword";

export function LoginForm() {
	const router = useRouter();
	const params = useParams<{ channel: string }>();
	const searchParams = useSearchParams();
	const { signIn } = useSaleorAuthContext();

	// Check if this is a password reset callback
	const resetEmail = searchParams.get("email");
	const resetToken = searchParams.get("token");

	const [mode, setMode] = useState<FormMode>(resetEmail && resetToken ? "setPassword" : "login");

	const [email, setEmail] = useState(resetEmail || "");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [resetEmailSent, setResetEmailSent] = useState(false);
	const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

	// Update mode when URL params change
	useEffect(() => {
		if (resetEmail && resetToken) {
			setMode("setPassword");
			setEmail(resetEmail);
		}
	}, [resetEmail, resetToken]);

	const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email || !validateEmail(email)) {
			setError("Ingresa un correo electrónico válido");
			return;
		}

		if (!password) {
			setError("Ingresa tu contraseña");
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await signIn({ email, password });

			if (result.data?.tokenCreate?.errors?.length) {
				const err = result.data.tokenCreate.errors[0];
				// Check for invalid credentials by message pattern
				const isInvalidCredentials =
					err.message?.toLowerCase().includes("invalid") ||
					err.message?.toLowerCase().includes("credentials");
				if (isInvalidCredentials) {
					setError("Correo o contraseña incorrectos. Intenta de nuevo.");
				} else {
					setError(err.message || "Error al iniciar sesión");
				}
				return;
			}

			if (result.data?.tokenCreate?.token) {
				router.push(`/${params.channel}`);
				router.refresh();
			}
		} catch {
			setError("Ocurrió un error. Intenta de nuevo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!password) {
			setError("Ingresa una nueva contraseña");
			return;
		}

		if (password.length < 8) {
			setError("La contraseña debe tener al menos 8 caracteres");
			return;
		}

		if (password !== confirmPassword) {
			setError("Las contraseñas no coinciden");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/auth/set-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: resetEmail,
					token: resetToken,
					password,
				}),
			});

			const data = (await response.json()) as {
				errors?: Array<{ message: string; code?: string }>;
				success?: boolean;
			};

			if (data.errors?.length) {
				const err = data.errors[0];
				if (err.code === "INVALID_TOKEN" || err.message?.includes("token")) {
					setError("Este enlace de recuperación ha expirado. Solicita uno nuevo.");
				} else {
					setError(err.message || "Error al establecer la contraseña");
				}
				return;
			}

			if (data.success) {
				setPasswordResetSuccess(true);
				// Clear URL params and redirect to clean login
				setTimeout(() => {
					router.push(`/${params.channel}/login`);
					router.refresh();
				}, 2000);
			}
		} catch {
			setError("Ocurrió un error. Intenta de nuevo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleForgotPassword = async () => {
		setError("");
		setSuccessMessage("");

		if (!email) {
			setError("Ingresa tu correo electrónico primero");
			return;
		}

		if (!validateEmail(email)) {
			setError("Ingresa un correo electrónico válido");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					channel: params.channel,
					redirectUrl: `${window.location.origin}/${params.channel}/login`,
				}),
			});

			const data = (await response.json()) as {
				errors?: Array<{ message: string }>;
				success?: boolean;
			};

			if (data.errors?.length) {
				setError(data.errors[0].message || "Error al enviar el enlace de recuperación");
				return;
			}

			setResetEmailSent(true);
			setSuccessMessage(
				`Si existe una cuenta para ${email}, se ha enviado un enlace de recuperación. Nota: Solo puedes solicitar un enlace cada 15 minutos.`,
			);
		} catch {
			setError("Ocurrió un error. Intenta de nuevo.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Success state after password reset
	if (passwordResetSuccess) {
		return (
			<div className="mx-auto mt-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="flex flex-col items-center gap-4 text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
							<CheckCircle className="h-8 w-8 text-green-600" />
						</div>
						<h1 className="text-2xl font-semibold">¡Contraseña actualizada!</h1>
						<p className="text-muted-foreground">
							Tu contraseña se ha restablecido exitosamente. Ya iniciaste sesión.
						</p>
						<p className="text-sm text-muted-foreground">Redirigiendo a la tienda...</p>
					</div>
				</div>
			</div>
		);
	}

	// Set New Password mode
	if (mode === "setPassword") {
		return (
			<div className="mx-auto mt-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="mb-6 text-center">
						<h1 className="text-2xl font-semibold">Nueva contraseña</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Ingresa una nueva contraseña para <span className="font-medium">{resetEmail}</span>
						</p>
					</div>

					<form onSubmit={handleSetPassword} className="space-y-4">
						{error && (
							<div className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">{error}</div>
						)}

						{/* New Password */}
						<div className="space-y-1.5">
							<Label htmlFor="password" className="text-sm font-medium">
								Nueva contraseña
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Mínimo 8 caracteres"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
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

						{/* Confirm Password */}
						<div className="space-y-1.5">
							<Label htmlFor="confirmPassword" className="text-sm font-medium">
								Confirmar contraseña
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Confirma tu contraseña"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="h-12 pl-10 pr-10"
									required
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
						</div>

						<Button type="submit" disabled={isSubmitting} className="h-12 w-full text-base font-semibold">
							{isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
						</Button>

						<div className="text-center">
							<Link
								href={`/${params.channel}/login`}
								className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
							>
								Volver a iniciar sesión
							</Link>
						</div>
					</form>
				</div>
			</div>
		);
	}

	// Default Login mode
	return (
		<div className="mx-auto mt-16 w-full max-w-md">
			<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-semibold">Bienvenido de vuelta</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						&iquest;No tienes cuenta?{" "}
						<Link
							href={`/${params.channel}/signup`}
							className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
						>
							Regístrate
						</Link>
					</p>
				</div>

				<form onSubmit={handleLogin} className="space-y-4">
					{error && <div className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">{error}</div>}

					{successMessage && (
						<div className="rounded-md bg-green-100 p-3 text-sm text-green-800">{successMessage}</div>
					)}

					{/* Email */}
					<div className="space-y-1.5">
						<Label htmlFor="email" className="text-sm font-medium">
							Correo electrónico
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									setResetEmailSent(false);
								}}
								className="h-12 pl-10"
								required
							/>
						</div>
					</div>

					{/* Password */}
					<div className="space-y-1.5">
						<Label htmlFor="password" className="text-sm font-medium">
							Contraseña
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Ingresa tu contraseña"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
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

					{/* Forgot Password */}
					<div className="flex justify-end">
						<button
							type="button"
							onClick={handleForgotPassword}
							disabled={isSubmitting}
							className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline disabled:opacity-50"
						>
							{resetEmailSent ? "¿Reenviar enlace?" : "¿Olvidaste tu contraseña?"}
						</button>
					</div>

					<Button type="submit" disabled={isSubmitting} className="h-12 w-full text-base font-semibold">
						{isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
					</Button>
				</form>
			</div>
		</div>
	);
}
