import { Suspense } from "react";
import { Loader } from "@/ui/atoms/loader";
import { SignUpForm } from "@/ui/components/sign-up-form";

export const metadata = {
	title: "Crear cuenta",
	description: "Crea una cuenta para guardar tus direcciones e historial de pedidos.",
};

export default function SignUpPage() {
	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<SignUpForm />
			</section>
		</Suspense>
	);
}
