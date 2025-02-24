import { redirect } from "next/navigation";

export default function Home() {
  redirect("/email-config"); // Redirects to the correct page
}
