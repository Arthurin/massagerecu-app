export async function POST(req: Request) {
  const formData = await req.formData();

  const res = await fetch(
    "https://go.formulaire.info/data_user/v5SWqXJ5/cc7VjqH2/preview/recorder.php",
    {
      method: "POST",
      body: formData,
    }
  );
  //réponse du serveur quand ça marche : Language string failed to load: recipients_failed<script>parent.redir_to_page("https://www.massagerecu.fr/");</script>
  const rawText = await res.text();

  // Analyse minimale
  console.log("Newsletter subscription response:", rawText);

  return new Response(null, { status: res.status });
}
