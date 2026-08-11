/* =========================================================
   GARZ MANAGER — GOOGLE SHEETS CONNECTION
   ========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxFI1k65tY7BfydbB4C9X6yGH8cFO9_MjAsUGd1QEHw7k4fcB8AYaew4kGyh__hr5Ki/exec";


/* =========================================================
   LOCAL CACHE
   ========================================================= */

const DB_KEY = "garz_manager_cache_v2";

let db = {
    clients: [],
    orders: [],
    payments: [],
    activity: []
};


function saveDB() {
    localStorage.setItem(
        DB_KEY,
        JSON.stringify(db)
    );
}


function loadCachedDB() {
    try {
        const cached =
            JSON.parse(
                localStorage.getItem(DB_KEY)
            );

        if (!cached) return;

        db = {
            clients: Array.isArray(cached.clients)
                ? cached.clients
                : [],

            orders: Array.isArray(cached.orders)
                ? cached.orders
                : [],

            payments: Array.isArray(cached.payments)
                ? cached.payments
                : [],

            activity: Array.isArray(cached.activity)
                ? cached.activity
                : []
        };

    } catch (error) {
        console.error(
            "Cache error:",
            error
        );
    }
}


/* =========================================================
   GOOGLE SHEETS → WEBSITE
   ========================================================= */

async function getGoogleData() {

    const response = await fetch(
        API_URL +
        "?action=getAll&t=" +
        Date.now()
    );

    if (!response.ok) {
        throw new Error(
            "Google Sheets connection failed."
        );
    }

    const result =
        await response.json();

    if (!result.success) {
        throw new Error(
            result.error ||
            "Google Sheets returned an error."
        );
    }

    return result.data;
}


/* =========================================================
   WEBSITE → GOOGLE SHEETS
   ========================================================= */

async function sendToGoogle(
    action,
    data = {}
) {

    const response =
        await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify({
                    action: action,
                    data: data
                })
            }
        );

    if (!response.ok) {
        throw new Error(
            "Could not reach Google Apps Script."
        );
    }

    const result =
        await response.json();

    if (!result.success) {
        throw new Error(
            result.error ||
            "Google Apps Script error."
        );
    }

    return result.data;
}


/* =========================================================
   NORMALIZE GOOGLE SHEETS DATA
   ========================================================= */

function value(row, ...keys) {

    for (const key of keys) {

        if (
            row &&
            row[key] !== undefined &&
            row[key] !== null
        ) {
            return row[key];
        }
    }

    return "";
}


function normalizeClient(row) {

    return {

        id:
            value(row, "id", "ID"),

        name:
            String(
                value(row, "name", "Name")
            ),

        discord:
            String(
                value(row, "discord", "Discord")
            ),

        email:
            String(
                value(row, "email", "Email")
            ),

        notes:
            String(
                value(row, "notes", "Notes")
            ),

        createdAt:
            value(
                row,
                "createdAt",
                "Created"
            )
    };
}


function normalizeOrder(row) {

    const status =
        String(
            value(
                row,
                "status",
                "Status"
            ) ||
            "Inquiry"
        );

    return {

        id:
            value(
                row,
                "id",
                "ID"
            ),

        clientId:
            value(
                row,
                "clientId",
                "Client ID"
            ),

        service:
            String(
                value(
                    row,
                    "service",
                    "Service"
                )
            ),

        price:
            Number(
                value(
                    row,
                    "price",
                    "Price"
                ) || 0
            ),

        status: status,

        deadline:
            normalizeDate(
                value(
                    row,
                    "deadline",
                    "Deadline"
                )
            ),

        description:
            String(
                value(
                    row,
                    "description",
                    "Description"
                )
            ),

        notes:
            String(
                value(
                    row,
                    "notes",
                    "Notes"
                )
            ),

        createdAt:
            value(
                row,
                "createdAt",
                "Created"
            ),

        paid:
            status === "Paid"
    };
}


function normalizePayment(row) {

    return {

        id:
            value(row, "id", "ID"),

        orderId:
            value(
                row,
                "orderId",
                "Order ID"
            ),

        clientId:
            value(
                row,
                "clientId",
                "Client ID"
            ),

        amount:
            Number(
                value(
                    row,
                    "amount",
                    "Amount"
                ) || 0
            ),

        method:
            String(
                value(
                    row,
                    "method",
                    "Method"
                )
            ),

        status:
            String(
                value(
                    row,
                    "status",
                    "Status"
                ) ||
                "Pending"
            ),

        paidDate:
            normalizeDate(
                value(
                    row,
                    "paidDate",
                    "Paid Date"
                )
            )
    };
}


function normalizeActivity(row) {

    return {

        timestamp:
            value(
                row,
                "timestamp",
                "Timestamp"
            ),

        action:
            String(
                value(
                    row,
                    "action",
                    "Action"
                )
            ),

        orderId:
            value(
                row,
                "orderId",
                "Order ID"
            ),

        client:
            String(
                value(
                    row,
                    "client",
                    "Client"
                )
            ),

        details:
            String(
                value(
                    row,
                    "details",
                    "Details"
                )
            )
    };
}


function normalizeDate(date) {

    if (!date) return "";

    const string =
        String(date);

    if (
        /^\d{4}-\d{2}-\d{2}/
            .test(string)
    ) {
        return string.slice(
            0,
            10
        );
    }

    return string;
}


/* =========================================================
   SYNC GOOGLE SHEETS
   ========================================================= */

async function syncFromGoogle(
    showMessage = true
) {

    try {

        const data =
            await getGoogleData();

        db = {

            clients:
                Array.isArray(
                    data.clients
                )
                    ? data.clients.map(
                        normalizeClient
                    )
                    : [],

            orders:
                Array.isArray(
                    data.orders
                )
                    ? data.orders.map(
                        normalizeOrder
                    )
                    : [],

            payments:
                Array.isArray(
                    data.payments
                )
                    ? data.payments.map(
                        normalizePayment
                    )
                    : [],

            activity:
                Array.isArray(
                    data.activity
                )
                    ? data.activity.map(
                        normalizeActivity
                    )
                    : []
        };

        saveDB();

        if (
            typeof renderAll ===
            "function"
        ) {
            renderAll();
        }

        if (
            showMessage &&
            typeof toast ===
            "function"
        ) {
            toast(
                "Connected to Google Sheets ✓"
            );
        }

        return true;

    } catch (error) {

        console.error(
            "Google Sheets:",
            error
        );

        if (
            showMessage &&
            typeof toast ===
            "function"
        ) {
            toast(
                "Google Sheets connection failed",
                true
            );
        }

        return false;
    }
}


/* =========================================================
   CLIENT
   ========================================================= */

async function createClient(
    client
) {

    const result =
        await sendToGoogle(
            "createClient",
            client
        );

    await syncFromGoogle(
        false
    );

    return result;
}


/* =========================================================
   ORDER
   ========================================================= */

async function createOrder(
    order
) {

    const result =
        await sendToGoogle(
            "createOrder",
            order
        );

    await syncFromGoogle(
        false
    );

    return result;
}


/* =========================================================
   CHANGE STATUS
   ========================================================= */

async function updateOrderStatus(
    orderId,
    status
) {

    const result =
        await sendToGoogle(
            "updateOrderStatus",
            {
                orderId:
                    orderId,

                status:
                    status
            }
        );

    await syncFromGoogle(
        false
    );

    return result;
}


/* =========================================================
   PAYMENT
   ========================================================= */

async function createPayment(
    payment
) {

    const result =
        await sendToGoogle(
            "createPayment",
            payment
        );

    await syncFromGoogle(
        false
    );

    return result;
}


/* =========================================================
   START
   ========================================================= */

loadCachedDB();

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (
            typeof renderAll ===
            "function"
        ) {
            renderAll();
        }

        await syncFromGoogle(
            false
        );

    }
);