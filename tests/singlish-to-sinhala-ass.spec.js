const { test, expect } = require("@playwright/test");

const SITE_URL = "https://www.swifttranslator.com/";


async function openSite(page) {
  await page.goto(SITE_URL, { waitUntil: "domcontentloaded" });
}

function getInputLocator(page) {
  return page.getByPlaceholder("Input Your Singlish Text Here.");
}

function getOutputLocator(page) {
  return page.locator('.card:has-text("Sinhala") .bg-slate-50').first();
}


async function readOutput(locator) {
  const t = await locator.textContent();
  return (t || "").replace(/\r\n/g, "\n");
}

function normalize(s) {
  return (s || "").replace(/\r\n/g, "\n").trim();
}

// --------- Test Data (Positive test data) ----------
const positiveCases = [
  {
    id: "Pos_Fun_0001",
    input: "mama office yanna hadhanavaa.",
    expected: "මම office යන්න හදනවා."
  },
  {
    id: "Pos_Fun_0002",
    input: "mata thee bonna oonee.",
    expected: "මට තේ බොන්න ඕනේ."
  },
  {
    id: "Pos_Fun_0003",
    input: "api shopping yamu saha passe lunch kamu.",
    expected: "අපි shopping යමු සහ පස්සෙ lunch කමු."
  },
  {
    id: "Pos_Fun_0004",
    input: "oya late unoth mama thaniyen yannam",
    expected: "ඔය late උනොත් මම තනියෙන් යන්නම්"
  },
  {
  id: "Pos_Fun_0005",
  input: "oyaa adha free dha?",
  expected: "ඔයා අද free ද?"
},
{
  id: "Pos_Fun_0006",
  input: "meeka hariyata balanna.",
  expected: "මේක හරියට බලන්න."
},
{
  id: "Pos_Fun_0007",
  input: "mata adha enne baee.",
  expected: "මට අද එන්නෙ බෑ."
},
{
  id: "Pos_Fun_0008",
  input: "suba dhavasak!",
  expected: "සුබ දවසක්!"
},
{
  id: "Pos_Fun_0009",
  input: "karuNaakaralaa mage file eka balanna puluvandha?",
  expected: "කරුණාකරලා mage file එක බලන්න පුලුවන්ද?"
},
{
  id: "Pos_Fun_00010",
  input: "hari ne, api passe yamu.",
  expected: "හරි නේ, අපි පස්සෙ යමු."
},
{
  id: "Pos_Fun_00011",
  input: "mama dhaen assignment karanavaa",
  expected: "මම දැන් assignment කරනවා"
},
{
  id: "Pos_Fun_00012",
  input: "mama iiyee bus eken giyaa",
  expected: "මම ඊයේ bus එකෙන් ගියා"
},
{
  id: "Pos_Fun_00013",
  input: "api heta evening eka miit venna yamu.",
  expected: "අපි හෙට evening එක මීට් වෙන්න යමු."
},
{
  id: "Pos_Fun_0014",
  input: "api meeka dhaen karamu.",
  expected: "අපි මේක දැන් කරමු."
},
{
  id: "Pos_Fun_0015",
  input: "lamayi class eka athulata enna.",
  expected: "ලමයි class එක අතුලට එන්න."
},
{
  id: "Pos_Fun_0016",
  input: "oyaata puluvannam mata message ekak dhaanna",
  expected: "ඔයාට පුලුවන්නම් මට message එකක් දාන්න"
},
{
  id: "Pos_Fun_0017",
  input: "mama WiFi connect karagena Zoom eka open karanavaa.",
  expected: "මම WiFi connect කරගෙන Zoom එක open කරනවා."
},
{
  id: "Pos_Fun_0018",
  input: "api Colombo idhalaa Galle valata yamu.",
  expected: "අපි Colombo ඉදලා Galle වලට යමු."
},
{
  id: "Pos_Fun_0019",
  input: "mage ID ekea form eka dhaanna.",
  expected: "mage ID එකේ form එක දාන්න."
},
{
  id: "Pos_Fun_0020",
  input: "eyaa kivuvee 'mama ennam'kiyalaa.",
  expected: "එයා කිවුවේ 'මම එන්නම්'කියලා."
},
{
  id: "Pos_Fun_0021",
  input: "mata Rs. 2500 vagee gaanak oonee",
  expected: "මට Rs. 2500 වගේ ගානක් ඕනේ"
},
{
  id: "Pos_Fun_0022",
  input: "adha 7.15 PM venakota call karanna.",
  expected: "අද 7.15 PM වෙනකොට call කරන්න."
},
{
  id: "Pos_Fun_0023",
  input: "2026-03-10 dhinata meeting eka set karamu.",
  expected: "2026-03-10 දිනට meeting එක සෙට් කරමු."
},
{
  id: "Pos_Fun_0024",
  input: "mama poddak innam.",
  expected: "මම පොඩ්ඩක් ඉන්නම්."
}

];

// --------- Test Data (Negative test data) ----------
const negativeCases = [
  {
  id: "Neg_Fun_0001",
  input: "mama office  yanwaa",
  expected: "mමම office යනවා"
},
{
  id: "Neg_Fun_0002",
  input: "mata tee oonee",
  expected: "මට tea ඕනි"
},
{
  id: "Neg_Fun_0003",
  input: "ado machan loku wadaak ne.",
  expected: "අඩෝ machan ලොකු වැඩක් නෑ."
},
{
  id: "Neg_Fun_0004",
  input: "oyaa kals enne nadda???",
  expected: "ඔයා කල්ස් එන්නෙ නැද්ද???"
},
{
  id: "Neg_Fun_0005",
  input: "mama ada happy.",
  expected: "මම අද happy "
},
{
  id: "Neg_Fun_0006",
  input: "mama gamee yanawa.",
  expected: "මම ගමේ යනවා."
},
{
  id: "Neg_Fun_0007",
  input: "mama gedhara yanawa",
  expected: "මම ගෙදර යනවා."
},
{
  id: "Neg_Fun_0008",
  input: "api passe call karamu.oya enne da?",
  expected: "අපි පස්සෙ call කරමු.ඔය එන්නෙ ද?"
},
{
  id: "Neg_Fun_0009",
  input: "mama adha morning indala class, lab, assignment saha part-time wada okkoma karala thiyenava. passe evening eka traffic nisaa late wenna puluvan. e nisa mama yanna kalin message ekak danna hadanava. oyata puluvannam eya okkoma balala reply karanna. thank you.",
  expected: "අද morning ඉන්දල class, lab, assignment සහ part-time වැඩ ඔක්කොම කරා ඒ නිසා හවසට traffic නිසා late වෙන්න පුළුවන්. එ නිස මම යන්න කලින් message එකක් දාන්නම්. ඔයාට පුළුවන්නම් ඒවා ඔක්කොම බලලා reply කරන්න .thank you"
},
{
  id: "Neg_Fun_00010",
  input: "mama kannada",
  expected: "මම කන්නද"
}


  
];

// --------- Tests ----------
test("open swifttranslator", async ({ page }) => {
  await openSite(page);

  const pageTitle = await page.title();
  console.log("page title is:", pageTitle);

  await expect(page).toHaveURL(SITE_URL);
  await expect(page).toHaveTitle(/Translator/i);
});

test.describe("SwiftTranslator – Positive Functional", () => {
  for (const tc of positiveCases) {
    test(`${tc.id} – should match expected Sinhala output`, async ({ page }) => {
      await openSite(page);

      const inputArea = getInputLocator(page);
      const outputBox = getOutputLocator(page);

      await inputArea.waitFor({ state: "visible", timeout: 10000 });
      await inputArea.fill(tc.input);

      await expect
        .poll(async () => normalize(await readOutput(outputBox)), {
          timeout: 20000,
          message: `Output did not match for ${tc.id}`
        })
        .toBe(normalize(tc.expected));
    });
  }
});

test.describe("SwiftTranslator – Negative Functional", () => {
  for (const tc of negativeCases) {
    test(`${tc.id} – should match expected Sinhala output`, async ({ page }) => {
      await openSite(page);

      const inputArea = getInputLocator(page);
      const outputBox = getOutputLocator(page);

      await inputArea.waitFor({ state: "visible", timeout: 10000 });
      await inputArea.fill(tc.input);

      await expect
        .poll(async () => normalize(await readOutput(outputBox)), {
          timeout: 20000,
          message: `Output did not match for ${tc.id}`
        })
        .toBe(normalize(tc.expected));
    });
  }
});

test("Pos_UI_0001 – Clearing input clears Sinhala output immediately", async ({ page }) => {
  await openSite(page);

  const inputArea = getInputLocator(page);
  const outputBox = getOutputLocator(page);

  await inputArea.waitFor({ state: "visible", timeout: 10000 });

  
  await inputArea.fill("api heta hambemu.");

  
  await expect
    .poll(async () => normalize(await readOutput(outputBox)), {
      timeout: 20000,
      message: "No output produced"
    })
    .not.toBe("");

  
  await inputArea.fill("");

  
  await expect
    .poll(async () => normalize(await readOutput(outputBox)), {
      timeout: 15000,
      message: "Output did not clear after clearing the input"
    })
    .toBe("");
});

test("Neg_UI_0001 – should respond within time for long gibberish input", async ({ page }) => {
  await openSite(page);

  const inputArea = getInputLocator(page);
  const outputBox = getOutputLocator(page);

  await inputArea.waitFor({ state: "visible", timeout: 10000 });

  const before = normalize(await readOutput(outputBox));
  const start = Date.now();

  await inputArea.fill(
    "ffnfnmlfnmltn fjnbfkrrh rkhmmlm tmhl5my5lye5lymolkjuyml hmyljmlt jtnhrenno nhkrehohnmkhmtm h5khm5olho 5o"
  );

  
  await expect
    .poll(async () => normalize(await readOutput(outputBox)) !== before, {
      timeout: 1000,
      message: "UI did not respond within 2000ms"
    })
    .toBe(true);

  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThanOrEqual(2000);
});