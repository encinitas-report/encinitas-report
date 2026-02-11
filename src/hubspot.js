/* HubSpot Forms API integration */
const PORTAL_ID = "245143409";
const FORM_ID = "ea8335bd-6fd8-4ee9-9cbb-b5669213e92b";

export async function submitToHubSpot({ firstName, lastName, email, phone, source, address, neighborhood }) {
  const fields = [
    { objectTypeId: "0-1", name: "firstname", value: firstName || "" },
    { objectTypeId: "0-1", name: "lastname", value: lastName || "" },
    { objectTypeId: "0-1", name: "email", value: email || "" },
  ];
  if (phone) fields.push({ objectTypeId: "0-1", name: "phone", value: phone });

  const context = {
    pageUri: window.location.href,
    pageName: source || "The Encinitas Report",
  };

  // Get HubSpot cookie if available
  const hutk = document.cookie.match(/hubspotutk=([^;]*)/)?.[1];
  if (hutk) context.hutk = hutk;

  try {
    const res = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields, context }),
      }
    );
    return res.ok;
  } catch (e) {
    console.error("HubSpot submission error:", e);
    return false;
  }
}
