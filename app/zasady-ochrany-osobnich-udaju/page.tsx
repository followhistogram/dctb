import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-custom-pink">
            Zásady ochrany osobních údajů
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none text-lg leading-relaxed">
          <h2 className="text-2xl font-semibold mt-6 mb-2">1. Úvod</h2>
          <p>
            Vítejte na našich stránkách. Vaše soukromí je pro nás důležité. Tyto zásady ochrany osobních údajů
            vysvětlují, jaké osobní údaje shromažďujeme a jak je používáme.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">2. Jaké údaje shromažďujeme</h2>
          <p>Můžeme shromažďovat následující typy údajů:</p>
          <ul>
            <li>
              <strong>Údaje, které nám poskytnete:</strong> Například při vyplnění kontaktního formuláře nebo registraci
              na událost.
            </li>
            <li>
              <strong>Údaje o používání:</strong> Informace o tom, jak používáte naše webové stránky, shromážděné pomocí
              souborů cookie a podobných technologií.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-2">3. Jak používáme soubory cookie</h2>
          <p>
            Naše webové stránky používají soubory cookie k vylepšení vašeho zážitku. Používáme následující typy souborů
            cookie:
          </p>
          <ul>
            <li>
              <strong>Nezbytné soubory cookie:</strong> Jsou nutné pro základní funkčnost webu.
            </li>
            <li>
              <strong>Analytické soubory cookie:</strong> Pomáhají nám porozumět, jak návštěvníci používají naše
              stránky, abychom je mohli vylepšovat.
            </li>
            <li>
              <strong>Marketingové soubory cookie:</strong> Používají se k personalizaci reklam a sledování úspěšnosti
              marketingových kampaní.
            </li>
          </ul>
          <p>
            Své preference ohledně souborů cookie můžete kdykoli spravovat prostřednictvím našeho banneru pro souhlas s
            cookies.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">4. Vaše práva</h2>
          <p>
            Máte právo na přístup k vašim osobním údajům, jejich opravu nebo výmaz. Máte také právo vznést námitku proti
            zpracování vašich údajů.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">5. Kontakt</h2>
          <p>
            Pokud máte jakékoli dotazy ohledně těchto zásad, kontaktujte nás prosím prostřednictvím naší kontaktní
            stránky.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
