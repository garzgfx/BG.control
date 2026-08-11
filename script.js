/* ============================================
   GARZ MANAGER
============================================ */

const DB_KEY = "garz_manager_v2";

let db = JSON.parse(
    localStorage.getItem(DB_KEY)
) || {
    clients: [],
    orders: [],
    nextOrderNumber: 1
};


/* ============================================
   DATABASE
============================================ */

function saveDB() {
    localStorage.setItem(
        DB_KEY,
        JSON.stringify(db)
    );
}


/* ============================================
   STATUSES
============================================ */

const STATUSES = [
    "Inquiry",
    "Accepted",
    "In Progress",
    "Review",
    "Revisions",
    "Completed",
    "Paid"
];


/* ============================================
   NAVIGATION
============================================ */

const navItems =
    document.querySelectorAll(".nav-item");

const pageInfo = {

    dashboard: [
        "Dashboard",
        "Here's what's happening with your business."
    ],

    orders: [
        "Orders",
        "Manage every project from one place."
    ],

    clients: [
        "Clients",
        "Your complete client database."
    ],

    calendar: [
        "Calendar",
        "Keep track of your deadlines."
    ],

    analytics: [
        "Analytics",
        "See how your business is performing."
    ]

};


navItems.forEach(button => {

    button.addEventListener(
        "click",
        () => showPage(button.dataset.page)
    );

});


document
    .querySelectorAll("[data-page-link]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => showPage(button.dataset.pageLink)
        );

    });


function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.remove("active");

        });


    const target =
        document.getElementById(
            `${page}-page`
        );


    if (!target) return;


    target.classList.add("active");


    navItems.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === page
        );

    });


    document
        .getElementById("page-title")
        .textContent =
        pageInfo[page][0];


    document
        .getElementById("page-description")
        .textContent =
        pageInfo[page][1];


    renderAll();

}


/* ============================================
   MODAL
============================================ */

const overlay =
    document.getElementById("modal-overlay");

const orderForm =
    document.getElementById("order-form");

const clientForm =
    document.getElementById("client-form");


function openOrderModal(orderId = null) {

    overlay.classList.add("open");

    clientForm.classList.add("hidden");
    orderForm.classList.remove("hidden");


    populateClientSelect();


    const editing =
        orderId !== null;


    document
        .getElementById("modal-title")
        .textContent =
        editing
            ? "Edit Order"
            : "New Order";


    document
        .getElementById("modal-subtitle")
        .textContent =
        editing
            ? "Update the project information."
            : "Create something new.";


    document
        .getElementById("order-submit-btn")
        .textContent =
        editing
            ? "Save Changes"
            : "Create Order";


    if (editing) {

        const order =
            db.orders.find(
                item =>
                    item.id === orderId
            );


        if (!order) return;


        document
            .getElementById("editing-order-id")
            .value =
            order.id;


        document
            .getElementById("order-client")
            .value =
            order.clientId;


        document
            .getElementById("order-service")
            .value =
            order.service;


        document
            .getElementById("order-price")
            .value =
            order.price;


        document
            .getElementById("order-deadline")
            .value =
            order.deadline;


        document
            .getElementById("order-status")
            .value =
            order.status;


        document
            .getElementById("order-description")
            .value =
            order.description || "";


        document
            .getElementById("order-notes")
            .value =
            order.notes || "";

    } else {

        orderForm.reset();

        document
            .getElementById("editing-order-id")
            .value = "";

        document
            .getElementById("order-status")
            .value =
            "Inquiry";

    }

}


function openClientModal(clientId = null) {

    overlay.classList.add("open");

    orderForm.classList.add("hidden");
    clientForm.classList.remove("hidden");


    const editing =
        clientId !== null;


    document
        .getElementById("modal-title")
        .textContent =
        editing
            ? "Edit Client"
            : "Add Client";


    document
        .getElementById("modal-subtitle")
        .textContent =
        editing
            ? "Update client information."
            : "Add someone to your client database.";


    document
        .getElementById("client-submit-btn")
        .textContent =
        editing
            ? "Save Changes"
            : "Add Client";


    if (editing) {

        const client =
            db.clients.find(
                item =>
                    item.id === clientId
            );


        if (!client) return;


        document
            .getElementById("editing-client-id")
            .value =
            client.id;


        document
            .getElementById("client-name")
            .value =
            client.name;


        document
            .getElementById("client-discord")
            .value =
            client.discord;


        document
            .getElementById("client-email")
            .value =
            client.email || "";


        document
            .getElementById("client-notes")
            .value =
            client.notes || "";

    } else {

        clientForm.reset();

        document
            .getElementById("editing-client-id")
            .value = "";

    }

}


function closeModal() {

    overlay.classList.remove("open");

    orderForm.reset();
    clientForm.reset();

}


document
    .getElementById("new-order-btn")
    .addEventListener(
        "click",
        () => openOrderModal()
    );


document
    .getElementById("quick-order")
    .addEventListener(
        "click",
        () => openOrderModal()
    );


document
    .getElementById("add-client-btn")
    .addEventListener(
        "click",
        () => openClientModal()
    );


document
    .getElementById("quick-client")
    .addEventListener(
        "click",
        () => openClientModal()
    );


document
    .getElementById("close-modal")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancel-modal")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancel-client")
    .addEventListener(
        "click",
        closeModal
    );


overlay.addEventListener(
    "click",
    event => {

        if (event.target === overlay) {
            closeModal();
        }

    }
);


/* ============================================
   CLIENT CREATE / EDIT
============================================ */

clientForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const editingId =
            document
                .getElementById(
                    "editing-client-id"
                )
                .value;


        const data = {

            name:
                document
                    .getElementById("client-name")
                    .value
                    .trim(),

            discord:
                document
                    .getElementById("client-discord")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("client-email")
                    .value
                    .trim(),

            notes:
                document
                    .getElementById("client-notes")
                    .value
                    .trim()

        };


        if (editingId) {

            const client =
                db.clients.find(
                    item =>
                        item.id === editingId
                );


            if (!client) return;


            Object.assign(
                client,
                data
            );


            toast(
                "Client updated successfully."
            );

        } else {

            db.clients.push({

                id:
                    generateId("client"),

                ...data,

                createdAt:
                    new Date().toISOString()

            });


            toast(
                "Client added successfully."
            );

        }


        saveDB();

        closeModal();

        renderAll();

    }
);


/* ============================================
   ORDER CREATE / EDIT
============================================ */

orderForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const editingId =
            document
                .getElementById(
                    "editing-order-id"
                )
                .value;


        const clientId =
            document
                .getElementById(
                    "order-client"
                )
                .value;


        if (!clientId) {

            toast(
                "Select a client first.",
                true
            );

            return;

        }


        const data = {

            clientId,

            service:
                document
                    .getElementById("order-service")
                    .value,

            price:
                Number(
                    document
                        .getElementById("order-price")
                        .value
                ),

            deadline:
                document
                    .getElementById("order-deadline")
                    .value,

            status:
                document
                    .getElementById("order-status")
                    .value,

            description:
                document
                    .getElementById("order-description")
                    .value
                    .trim(),

            notes:
                document
                    .getElementById("order-notes")
                    .value
                    .trim()

        };


        if (editingId) {

            const order =
                db.orders.find(
                    item =>
                        item.id === editingId
                );


            if (!order) return;


            Object.assign(
                order,
                data
            );


            order.paid =
                order.status === "Paid";


            toast(
                `${order.id} updated successfully.`
            );

        } else {

            const orderNumber =
                getNextOrderNumber();


            db.orders.push({

                id:
                    `GARZ-${String(orderNumber).padStart(3,"0")}`,

                ...data,

                paid:
                    data.status === "Paid",

                createdAt:
                    new Date().toISOString()

            });


            toast(
                "Order created successfully."
            );

        }


        saveDB();

        closeModal();

        renderAll();

    }
);


/* ============================================
   CLIENT SELECT
============================================ */

function populateClientSelect() {

    const select =
        document.getElementById(
            "order-client"
        );


    select.innerHTML =
        `<option value="">
            Select client
        </option>`;


    db.clients.forEach(
        client => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                client.id;


            option.textContent =
                `${client.name} — ${client.discord}`;


            select.appendChild(
                option
            );

        }
    );

}


/* ============================================
   DELETE CLIENT
============================================ */

function deleteClient(
    clientId
) {

    const client =
        getClient(clientId);


    if (!client) return;


    const clientOrders =
        db.orders.filter(
            order =>
                order.clientId === clientId
        );


    const confirmed =
        confirm(
            `Delete "${client.name}"?\n\n` +
            `Their ${clientOrders.length} order(s) will NOT be deleted. ` +
            `Those orders will remain in your history.`
        );


    if (!confirmed) return;


    db.clients =
        db.clients.filter(
            client =>
                client.id !== clientId
        );


    saveDB();

    renderAll();


    toast(
        `${client.name} deleted.`
    );

}


/* ============================================
   DELETE ORDER
============================================ */

function deleteOrder(
    orderId
) {

    const order =
        db.orders.find(
            item =>
                item.id === orderId
        );


    if (!order) return;


    const client =
        getClient(
            order.clientId
        );


    const confirmed =
        confirm(
            `Delete ${order.id}?\n\n` +
            `Service: ${order.service}\n` +
            `Client: ${client?.name || "Deleted client"}\n` +
            `Price: ${money(order.price)}\n\n` +
            `This cannot be undone.`
        );


    if (!confirmed) return;


    db.orders =
        db.orders.filter(
            item =>
                item.id !== orderId
        );


    saveDB();

    renderAll();


    toast(
        `${order.id} deleted.`
    );

}


/* ============================================
   ORDER STATUS
============================================ */

function changeStatus(
    select
) {

    const order =
        db.orders.find(
            item =>
                item.id ===
                select.dataset.orderId
        );


    if (!order) return;


    order.status =
        select.value;


    order.paid =
        order.status === "Paid";


    saveDB();

    renderAll();


    toast(
        `${order.id} → ${order.status}`
    );

}


/* ============================================
   DASHBOARD
============================================ */

function renderDashboard() {

    const active =
        db.orders.filter(
            order =>
                [
                    "In Progress",
                    "Review",
                    "Revisions"
                ].includes(order.status)
        ).length;


    const pending =
        db.orders.filter(
            order =>
                [
                    "Inquiry",
                    "Accepted"
                ].includes(order.status)
        ).length;


    const revenue =
        db.orders
            .filter(
                order =>
                    order.status === "Paid"
            )
            .reduce(
                (sum, order) =>
                    sum +
                    Number(order.price || 0),
                0
            );


    document.getElementById(
        "stat-active"
    ).textContent =
        active;


    document.getElementById(
        "stat-pending"
    ).textContent =
        pending;


    document.getElementById(
        "stat-revenue"
    ).textContent =
        money(revenue);


    document.getElementById(
        "stat-clients"
    ).textContent =
        db.clients.length;


    renderRecentOrders();

    renderUpcoming();

}


/* ============================================
   RECENT ORDERS
============================================ */

function renderRecentOrders() {

    const container =
        document.getElementById(
            "recent-orders"
        );


    const orders =
        [...db.orders]
            .reverse()
            .slice(0,6);


    if (!orders.length) {

        container.innerHTML =
            empty(
                "No orders yet",
                "Create your first order above."
            );

        return;

    }


    container.innerHTML =
        orders
            .map(
                orderRow
            )
            .join("");

}


/* ============================================
   ORDERS
============================================ */

function renderOrders() {

    const container =
        document.getElementById(
            "orders-table"
        );


    let orders =
        [...db.orders].reverse();


    const search =
        document
            .getElementById(
                "order-search"
            )
            .value
            .toLowerCase();


    const filter =
        document
            .getElementById(
                "status-filter"
            )
            .value;


    orders =
        orders.filter(
            order => {

                const client =
                    getClient(
                        order.clientId
                    );


                const searchable =
                    [
                        order.id,
                        order.service,
                        order.description,
                        client?.name || "",
                        client?.discord || ""
                    ]
                        .join(" ")
                        .toLowerCase();


                return (
                    searchable.includes(search) &&
                    (
                        filter === "all" ||
                        order.status === filter
                    )
                );

            }
        );


    if (!orders.length) {

        container.innerHTML =
            empty(
                "No orders found",
                "Try changing your search or filters."
            );

        return;

    }


    container.innerHTML =
        orders
            .map(
                orderRow
            )
            .join("");

}


/* ============================================
   ORDER ROW
============================================ */

function orderRow(
    order
) {

    const client =
        getClient(
            order.clientId
        );


    return `

        <div class="order-row">

            <div>

                <div class="order-name">
                    ${escapeHTML(order.service)}
                </div>

                <div class="order-meta">

                    ${escapeHTML(order.id)}

                    ·

                    ${escapeHTML(
                        client?.name ||
                        "Deleted client"
                    )}

                </div>

            </div>


            <div>

                <select
                    class="status-select"
                    data-order-id="${order.id}"
                    onchange="changeStatus(this)"
                >

                    ${STATUSES
                        .map(
                            status => `
                                <option
                                    value="${status}"
                                    ${status === order.status ? "selected" : ""}
                                >
                                    ${status}
                                </option>
                            `
                        )
                        .join("")}

                </select>

            </div>


            <div>

                <div class="order-meta">
                    Deadline
                </div>

                <div class="order-name">
                    ${formatDate(order.deadline)}
                </div>

            </div>


            <div class="order-price">
                ${money(order.price)}
            </div>


            <div class="order-actions">

                <button
                    class="icon-btn"
                    title="Edit order"
                    onclick="openOrderModal('${order.id}')"
                >
                    ✎
                </button>

                <button
                    class="icon-btn delete"
                    title="Delete order"
                    onclick="deleteOrder('${order.id}')"
                >
                    ×
                </button>

            </div>

        </div>

    `;

}


/* ============================================
   CLIENTS
============================================ */

function renderClients() {

    const container =
        document.getElementById(
            "clients-grid"
        );


    const search =
        document
            .getElementById(
                "client-search"
            )
            .value
            .toLowerCase();


    const clients =
        db.clients.filter(
            client => {

                const searchable =
                    [
                        client.name,
                        client.discord,
                        client.email,
                        client.notes
                    ]
                        .join(" ")
                        .toLowerCase();


                return searchable.includes(
                    search
                );

            }
        );


    if (!clients.length) {

        container.innerHTML =
            empty(
                "No clients",
                "Add your first client."
            );

        return;

    }


    container.innerHTML =
        clients
            .map(
                clientCard
            )
            .join("");

}


/* ============================================
   CLIENT CARD
============================================ */

function clientCard(
    client
) {

    const orders =
        db.orders.filter(
            order =>
                order.clientId ===
                client.id
        );


    const spent =
        orders.reduce(
            (sum, order) =>
                sum +
                Number(order.price || 0),
            0
        );


    return `

        <div class="client-card">

            <div class="client-avatar">
                ${escapeHTML(
                    client.name
                        .charAt(0)
                        .toUpperCase()
                )}
            </div>

            <h3>
                ${escapeHTML(client.name)}
            </h3>

            <div class="client-discord">
                ${escapeHTML(client.discord)}
            </div>


            ${
                client.email
                    ? `
                        <div class="order-meta">
                            ${escapeHTML(client.email)}
                        </div>
                    `
                    : ""
            }


            <div class="client-stats">

                <div class="client-stat">

                    <strong>
                        ${orders.length}
                    </strong>

                    <span>
                        Orders
                    </span>

                </div>


                <div class="client-stat">

                    <strong>
                        ${money(spent)}
                    </strong>

                    <span>
                        Value
                    </span>

                </div>

            </div>


            <div class="client-actions">

                <button
                    class="secondary-btn"
                    onclick="openClientModal('${client.id}')"
                >
                    ✎ Edit
                </button>

                <button
                    class="icon-btn delete"
                    title="Delete client"
                    onclick="deleteClient('${client.id}')"
                >
                    ×
                </button>

            </div>

        </div>

    `;

}


/* ============================================
   UPCOMING
============================================ */

function renderUpcoming() {

    const container =
        document.getElementById(
            "upcoming-deadlines"
        );


    const orders =
        [...db.orders]
            .filter(
                order =>
                    order.status !== "Paid"
            )
            .sort(
                (a,b) =>
                    new Date(a.deadline) -
                    new Date(b.deadline)
            )
            .slice(0,5);


    if (!orders.length) {

        container.innerHTML =
            empty(
                "All clear",
                "No upcoming deadlines."
            );

        return;

    }


    container.innerHTML =
        orders
            .map(
                order => {

                    const client =
                        getClient(
                            order.clientId
                        );


                    return `

                        <div
                            class="order-row"
                            style="
                                grid-template-columns:
                                1.4fr 1fr 110px;
                            "
                        >

                            <div>

                                <div class="order-name">
                                    ${escapeHTML(order.service)}
                                </div>

                                <div class="order-meta">
                                    ${escapeHTML(
                                        client?.name ||
                                        "Deleted client"
                                    )}
                                </div>

                            </div>


                            <div>
                                ${statusBadge(order.status)}
                            </div>


                            <div>
                                ${formatDate(order.deadline)}
                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* ============================================
   CALENDAR
============================================ */

let calendarDate =
    new Date();


function renderCalendar() {

    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    document
        .getElementById(
            "calendar-title"
        )
        .textContent =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    const grid =
        document.getElementById(
            "calendar-grid"
        );


    grid.innerHTML = "";


    const first =
        new Date(
            year,
            month,
            1
        );


    const last =
        new Date(
            year,
            month + 1,
            0
        );


    let startDay =
        first.getDay();


    startDay =
        startDay === 0
            ? 6
            : startDay - 1;


    for (
        let i = 0;
        i < startDay;
        i++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "calendar-day muted";


        grid.appendChild(
            cell
        );

    }


    for (
        let day = 1;
        day <= last.getDate();
        day++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "calendar-day";


        cell.innerHTML =
            `
                <div class="calendar-number">
                    ${day}
                </div>
            `;


        const date =
            `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;


        db.orders
            .filter(
                order =>
                    order.deadline === date
            )
            .forEach(
                order => {

                    const tag =
                        document.createElement(
                            "div"
                        );


                    tag.className =
                        "calendar-order";


                    tag.textContent =
                        `${order.id} · ${order.service}`;


                    cell.appendChild(
                        tag
                    );

                }
            );


        grid.appendChild(
            cell
        );

    }

}


document
    .getElementById("prev-month")
    .addEventListener(
        "click",
        () => {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );

            renderCalendar();

        }
    );


document
    .getElementById("next-month")
    .addEventListener(
        "click",
        () => {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );

            renderCalendar();

        }
    );


/* ============================================
   ANALYTICS
============================================ */

function renderAnalytics() {

    const orders =
        db.orders;


    const completed =
        orders.filter(
            order =>
                order.status === "Completed" ||
                order.status === "Paid"
        ).length;


    const revenue =
        orders.reduce(
            (sum, order) =>
                sum +
                Number(order.price || 0),
            0
        );


    const average =
        orders.length
            ? revenue / orders.length
            : 0;


    const conversion =
        orders.length
            ? Math.round(
                completed /
                orders.length *
                100
            )
            : 0;


    document
        .getElementById(
            "analytics-orders"
        )
        .textContent =
        orders.length;


    document
        .getElementById(
            "analytics-completed"
        )
        .textContent =
        completed;


    document
        .getElementById(
            "analytics-average"
        )
        .textContent =
        money(average);


    document
        .getElementById(
            "analytics-conversion"
        )
        .textContent =
        `${conversion}%`;


    renderRevenueChart();

    renderBestClients();

}


function renderRevenueChart() {

    const chart =
        document.getElementById(
            "revenue-chart"
        );


    const orders =
        [...db.orders]
            .slice(-12);


    if (!orders.length) {

        chart.innerHTML =
            `<div style="color:#858c9b;font-size:10px;">
                No revenue data yet.
            </div>`;

        return;

    }


    const max =
        Math.max(
            ...orders.map(
                order =>
                    Number(
                        order.price || 0
                    )
            ),
            1
        );


    chart.innerHTML =
        orders
            .map(
                order => {

                    const height =
                        (
                            Number(order.price || 0) /
                            max
                        ) * 100;


                    return `

                        <div
                            class="chart-bar"
                            style="
                                height:
                                ${Math.max(height,5)}%
                            "
                            title="
                                ${order.id}:
                                ${money(order.price)}
                            "
                        ></div>

                    `;

                }
            )
            .join("");

}


function renderBestClients() {

    const container =
        document.getElementById(
            "best-clients"
        );


    const ranking =
        db.clients
            .map(
                client => {

                    const spent =
                        db.orders
                            .filter(
                                order =>
                                    order.clientId ===
                                    client.id
                            )
                            .reduce(
                                (sum, order) =>
                                    sum +
                                    Number(order.price || 0),
                                0
                            );


                    return {
                        ...client,
                        spent
                    };

                }
            )
            .sort(
                (a,b) =>
                    b.spent -
                    a.spent
            )
            .slice(0,5);


    if (!ranking.length) {

        container.innerHTML =
            empty(
                "No clients yet",
                "Your best clients will appear here."
            );

        return;

    }


    container.innerHTML =
        ranking
            .map(
                (client,index) => `

                    <div
                        class="order-row"
                        style="
                            grid-template-columns:
                            30px 1fr 90px;
                        "
                    >

                        <strong>
                            #${index + 1}
                        </strong>

                        <div>

                            <div class="order-name">
                                ${escapeHTML(client.name)}
                            </div>

                            <div class="order-meta">
                                ${escapeHTML(client.discord)}
                            </div>

                        </div>

                        <strong>
                            ${money(client.spent)}
                        </strong>

                    </div>

                `
            )
            .join("");

}


/* ============================================
   SEARCH
============================================ */

document
    .getElementById("order-search")
    .addEventListener(
        "input",
        renderOrders
    );


document
    .getElementById("status-filter")
    .addEventListener(
        "change",
        renderOrders
    );


document
    .getElementById("client-search")
    .addEventListener(
        "input",
        renderClients
    );


/* ============================================
   GLOBAL SEARCH
============================================ */

document
    .getElementById("search-btn")
    .addEventListener(
        "click",
        () => {

            showPage("orders");

            document
                .getElementById(
                    "order-search"
                )
                .focus();

        }
    );


document.addEventListener(
    "keydown",
    event => {

        if (
            (event.metaKey ||
                event.ctrlKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            document
                .getElementById(
                    "search-btn"
                )
                .click();

        }

    }
);


/* ============================================
   UTILITIES
============================================ */

function generateId(
    prefix
) {

    return (
        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2,7)
    );

}


function getNextOrderNumber() {

    /*
       Makes sure deleted order IDs
       are never reused.
    */

    if (
        !db.nextOrderNumber ||
        db.nextOrderNumber < 1
    ) {

        const numbers =
            db.orders
                .map(
                    order => {

                        const match =
                            order.id.match(
                                /GARZ-(\d+)/
                            );

                        return match
                            ? Number(match[1])
                            : 0;

                    }
                );


        db.nextOrderNumber =
            Math.max(
                0,
                ...numbers
            ) + 1;

    }


    const number =
        db.nextOrderNumber;


    db.nextOrderNumber++;


    return number;

}


function getClient(
    id
) {

    return db.clients.find(
        client =>
            client.id === id
    );

}


function money(
    value
) {

    return (
        "€" +
        Number(
            value || 0
        ).toFixed(2)
    );

}


function formatDate(
    value
) {

    if (!value) return "—";


    const date =
        new Date(
            value + "T00:00:00"
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short"
        }
    );

}


function statusBadge(
    status
) {

    const classes = {

        "Inquiry":
            "status-inquiry",

        "Accepted":
            "status-accepted",

        "In Progress":
            "status-progress",

        "Review":
            "status-review",

        "Revisions":
            "status-revisions",

        "Completed":
            "status-completed",

        "Paid":
            "status-paid"

    };


    return `
        <span class="status ${classes[status] || ""}">
            ${escapeHTML(status)}
        </span>
    `;

}


function empty(
    title,
    description
) {

    return `

        <div
            style="
                padding:35px;
                text-align:center;
                color:#858c9b;
            "
        >

            <strong
                style="
                    display:block;
                    color:#f5f7fb;
                    margin-bottom:5px;
                    font-size:12px;
                "
            >
                ${escapeHTML(title)}
            </strong>

            <span style="font-size:10px;">
                ${escapeHTML(description)}
            </span>

        </div>

    `;

}


function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");

}


/* ============================================
   TOAST
============================================ */

let toastTimer;


function toast(
    message,
    error = false
) {

    const element =
        document.getElementById(
            "toast"
        );


    element.textContent =
        message;


    element.style.borderColor =
        error
            ? "rgba(255,91,110,.45)"
            : "rgba(53,208,127,.35)";


    element.classList.add("show");


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                element.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* ============================================
   RENDER EVERYTHING
============================================ */

function renderAll() {

    renderDashboard();

    renderOrders();

    renderClients();

    renderCalendar();

    renderAnalytics();

}


/* ============================================
   START
============================================ */

renderAll();    "Inquiry",
    "Accepted",
    "In Progress",
    "Review",
    "Revisions",
    "Completed",
    "Paid"
];


/* ============================================
   PAGE NAVIGATION
============================================ */

const navItems =
    document.querySelectorAll(".nav-item");


navItems.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            showPage(
                button.dataset.page
            );

        }
    );

});


document
    .querySelectorAll("[data-page-link]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showPage(
                    button.dataset.pageLink
                );

            }
        );

    });


const pageInfo = {

    dashboard: [
        "Dashboard",
        "Here's what's happening with your business."
    ],

    orders: [
        "Orders",
        "Manage every project from one place."
    ],

    clients: [
        "Clients",
        "Your complete client database."
    ],

    calendar: [
        "Calendar",
        "Keep track of your deadlines."
    ],

    analytics: [
        "Analytics",
        "See how your business is performing."
    ]

};


function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.remove(
                "active"
            );

        });


    const target =
        document.getElementById(
            `${page}-page`
        );


    if (!target) return;


    target.classList.add(
        "active"
    );


    navItems.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === page
        );

    });


    document
        .getElementById("page-title")
        .textContent =
        pageInfo[page][0];


    document
        .getElementById("page-description")
        .textContent =
        pageInfo[page][1];


    renderAll();

}


/* ============================================
   MODAL
============================================ */

const overlay =
    document.getElementById(
        "modal-overlay"
    );


const orderForm =
    document.getElementById(
        "order-form"
    );


const clientForm =
    document.getElementById(
        "client-form"
    );


function openModal(type) {

    overlay.classList.add(
        "open"
    );


    if (type === "client") {

        document
            .getElementById("modal-title")
            .textContent =
            "Add Client";

        orderForm.classList.add(
            "hidden"
        );

        clientForm.classList.remove(
            "hidden"
        );

    } else {

        document
            .getElementById("modal-title")
            .textContent =
            "New Order";

        clientForm.classList.add(
            "hidden"
        );

        orderForm.classList.remove(
            "hidden"
        );

        populateClientSelect();

    }

}


function closeModal() {

    overlay.classList.remove(
        "open"
    );

    orderForm.reset();
    clientForm.reset();

}


document
    .getElementById("new-order-btn")
    .addEventListener(
        "click",
        () => openModal("order")
    );


document
    .getElementById("quick-order")
    .addEventListener(
        "click",
        () => openModal("order")
    );


document
    .getElementById("add-client-btn")
    .addEventListener(
        "click",
        () => openModal("client")
    );


document
    .getElementById("quick-client")
    .addEventListener(
        "click",
        () => openModal("client")
    );


document
    .getElementById("close-modal")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancel-modal")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancel-client")
    .addEventListener(
        "click",
        closeModal
    );


overlay.addEventListener(
    "click",
    event => {

        if (
            event.target === overlay
        ) {

            closeModal();

        }

    }
);


/* ============================================
   CLIENT CREATION
============================================ */

clientForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const client = {

            id:
                generateId(
                    "client"
                ),

            name:
                document
                    .getElementById(
                        "client-name"
                    )
                    .value
                    .trim(),

            discord:
                document
                    .getElementById(
                        "client-discord"
                    )
                    .value
                    .trim(),

            email:
                document
                    .getElementById(
                        "client-email"
                    )
                    .value
                    .trim(),

            notes:
                document
                    .getElementById(
                        "client-notes"
                    )
                    .value
                    .trim(),

            createdAt:
                new Date().toISOString()

        };


        db.clients.push(
            client
        );


        saveDB();

        closeModal();

        renderAll();

        toast(
            "Client added successfully."
        );

    }
);


/* ============================================
   ORDER CREATION
============================================ */

orderForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const clientId =
            document
                .getElementById(
                    "order-client"
                )
                .value;


        const client =
            db.clients.find(
                item =>
                    item.id === clientId
            );


        if (!client) {

            toast(
                "Select a client first.",
                true
            );

            return;

        }


        const order = {

            id:
                generateOrderId(),

            clientId,

            service:
                document
                    .getElementById(
                        "order-service"
                    )
                    .value,

            price:
                Number(
                    document
                        .getElementById(
                            "order-price"
                        )
                        .value
                ),

            deadline:
                document
                    .getElementById(
                        "order-deadline"
                    )
                    .value,

            description:
                document
                    .getElementById(
                        "order-description"
                    )
                    .value
                    .trim(),

            notes:
                document
                    .getElementById(
                        "order-notes"
                    )
                    .value
                    .trim(),

            status:
                "Inquiry",

            paid:
                false,

            createdAt:
                new Date().toISOString()

        };


        db.orders.push(
            order
        );


        saveDB();

        closeModal();

        renderAll();

        toast(
            `${order.id} created successfully.`
        );

    }
);


/* ============================================
   CLIENT SELECT
============================================ */

function populateClientSelect() {

    const select =
        document.getElementById(
            "order-client"
        );


    select.innerHTML =
        `<option value="">
            Select client
        </option>`;


    db.clients.forEach(client => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            client.id;


        option.textContent =
            `${client.name} — ${client.discord}`;


        select.appendChild(
            option
        );

    });

}


/* ============================================
   DASHBOARD
============================================ */

function renderDashboard() {

    const active =
        db.orders.filter(
            order =>
                order.status ===
                "In Progress" ||
                order.status ===
                "Review" ||
                order.status ===
                "Revisions"
        ).length;


    const pending =
        db.orders.filter(
            order =>
                order.status ===
                "Inquiry" ||
                order.status ===
                "Accepted"
        ).length;


    const revenue =
        db.orders
            .filter(
                order =>
                    order.status === "Paid"
            )
            .reduce(
                (sum, order) =>
                    sum +
                    Number(order.price || 0),
                0
            );


    document
        .getElementById(
            "stat-active"
        )
        .textContent =
        active;


    document
        .getElementById(
            "stat-pending"
        )
        .textContent =
        pending;


    document
        .getElementById(
            "stat-revenue"
        )
        .textContent =
        money(revenue);


    document
        .getElementById(
            "stat-clients"
        )
        .textContent =
        db.clients.length;


    renderRecentOrders();

    renderUpcoming();

}


/* ============================================
   RECENT ORDERS
============================================ */

function renderRecentOrders() {

    const container =
        document.getElementById(
            "recent-orders"
        );


    const orders =
        [...db.orders]
            .reverse()
            .slice(0, 6);


    if (!orders.length) {

        container.innerHTML =
            empty(
                "No orders yet",
                "Create your first order above."
            );

        return;

    }


    container.innerHTML =
        orders
            .map(
                orderRow
            )
            .join("");

}


/* ============================================
   ORDERS PAGE
============================================ */

function renderOrders() {

    const container =
        document.getElementById(
            "orders-table"
        );


    let orders =
        [...db.orders]
            .reverse();


    const search =
        document
            .getElementById(
                "order-search"
            )
            .value
            .toLowerCase();


    const filter =
        document
            .getElementById(
                "status-filter"
            )
            .value;


    orders =
        orders.filter(order => {

            const client =
                getClient(
                    order.clientId
                );


            const matchesSearch =
                order.id
                    .toLowerCase()
                    .includes(search) ||

                order.service
                    .toLowerCase()
                    .includes(search) ||

                client?.name
                    ?.toLowerCase()
                    .includes(search) ||

                client?.discord
                    ?.toLowerCase()
                    .includes(search);


            const matchesStatus =
                filter === "all" ||
                order.status === filter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    if (!orders.length) {

        container.innerHTML =
            empty(
                "No orders found",
                "Try changing your search or filters."
            );

        return;

    }


    container.innerHTML =
        orders
            .map(
                orderRow
            )
            .join("");

}


/* ============================================
   ORDER ROW
============================================ */

function orderRow(
    order
) {

    const client =
        getClient(
            order.clientId
        );


    return `

        <div class="order-row">

            <div>

                <div class="order-name">
                    ${escapeHTML(order.service)}
                </div>

                <div class="order-meta">
                    ${escapeHTML(order.id)}
                    ·
                    ${escapeHTML(client?.discord || "Unknown")}
                </div>

            </div>


            <div>

                <select
                    class="status-select"
                    data-order-id="${order.id}"
                    onchange="changeStatus(this)"
                >

                    ${STATUSES
                        .map(
                            status => `
                                <option
                                    value="${status}"
                                    ${status === order.status ? "selected" : ""}
                                >
                                    ${status}
                                </option>
                            `
                        )
                        .join("")}

                </select>

            </div>


            <div>

                <div class="order-meta">
                    Deadline
                </div>

                <div class="order-name">
                    ${formatDate(order.deadline)}
                </div>

            </div>


            <div class="order-price">
                ${money(order.price)}
            </div>

        </div>

    `;

}


/* ============================================
   CHANGE STATUS
============================================ */

function changeStatus(
    select
) {

    const id =
        select.dataset.orderId;


    const order =
        db.orders.find(
            item =>
                item.id === id
        );


    if (!order) return;


    order.status =
        select.value;


    order.paid =
        select.value === "Paid";


    saveDB();

    renderAll();

    toast(
        `${id} → ${select.value}`
    );

}


/* ============================================
   CLIENTS
============================================ */

function renderClients() {

    const container =
        document.getElementById(
            "clients-grid"
        );


    const search =
        document
            .getElementById(
                "client-search"
            )
            .value
            .toLowerCase();


    const clients =
        db.clients.filter(
            client =>

                client.name
                    .toLowerCase()
                    .includes(search) ||

                client.discord
                    .toLowerCase()
                    .includes(search) ||

                client.email
                    .toLowerCase()
                    .includes(search)
        );


    if (!clients.length) {

        container.innerHTML =
            empty(
                "No clients",
                "Add your first client."
            );

        return;

    }


    container.innerHTML =
        clients
            .map(
                clientCard
            )
            .join("");

}


function clientCard(
    client
) {

    const orders =
        db.orders.filter(
            order =>
                order.clientId ===
                client.id
        );


    const spent =
        orders.reduce(
            (sum, order) =>
                sum +
                Number(order.price || 0),
            0
        );


    return `

        <div class="client-card">

            <div class="client-avatar">
                ${escapeHTML(
                    client.name
                        .charAt(0)
                        .toUpperCase()
                )}
            </div>

            <h3>
                ${escapeHTML(client.name)}
            </h3>

            <div class="client-discord">
                ${escapeHTML(client.discord)}
            </div>


            <div class="client-stats">

                <div class="client-stat">
                    <strong>
                        ${orders.length}
                    </strong>

                    <span>
                        Orders
                    </span>
                </div>


                <div class="client-stat">
                    <strong>
                        ${money(spent)}
                    </strong>

                    <span>
                        Value
                    </span>
                </div>

            </div>

        </div>

    `;

}


/* ============================================
   UPCOMING
============================================ */

function renderUpcoming() {

    const container =
        document.getElementById(
            "upcoming-deadlines"
        );


    const orders =
        [...db.orders]
            .filter(
                order =>
                    order.status !== "Paid"
            )
            .sort(
                (a, b) =>
                    new Date(a.deadline) -
                    new Date(b.deadline)
            )
            .slice(0, 5);


    if (!orders.length) {

        container.innerHTML =
            empty(
                "All clear",
                "No upcoming deadlines."
            );

        return;

    }


    container.innerHTML =
        orders
            .map(
                order => {

                    const client =
                        getClient(
                            order.clientId
                        );


                    return `

                        <div class="order-row">

                            <div>

                                <div class="order-name">
                                    ${escapeHTML(order.service)}
                                </div>

                                <div class="order-meta">
                                    ${escapeHTML(client?.name || "")}
                                </div>

                            </div>


                            <div>
                                ${statusBadge(order.status)}
                            </div>


                            <div>
                                ${formatDate(order.deadline)}
                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* ============================================
   CALENDAR
============================================ */

let calendarDate =
    new Date();


function renderCalendar() {

    const year =
        calendarDate.getFullYear();


    const month =
        calendarDate.getMonth();


    document
        .getElementById(
            "calendar-title"
        )
        .textContent =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    const grid =
        document.getElementById(
            "calendar-grid"
        );


    grid.innerHTML = "";


    const first =
        new Date(
            year,
            month,
            1
        );


    const last =
        new Date(
            year,
            month + 1,
            0
        );


    let startDay =
        first.getDay();


    startDay =
        startDay === 0
            ? 6
            : startDay - 1;


    for (
        let i = 0;
        i < startDay;
        i++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "calendar-day muted";


        grid.appendChild(
            cell
        );

    }


    for (
        let day = 1;
        day <= last.getDate();
        day++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "calendar-day";


        cell.innerHTML =
            `
                <div class="calendar-number">
                    ${day}
                </div>
            `;


        const date =
            `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;


        const dayOrders =
            db.orders.filter(
                order =>
                    order.deadline ===
                    date
            );


        dayOrders.forEach(
            order => {

                const tag =
                    document.createElement(
                        "div"
                    );


                tag.className =
                    "calendar-order";


                tag.textContent =
                    `${order.id} · ${order.service}`;


                cell.appendChild(
                    tag
                );

            }
        );


        grid.appendChild(
            cell
        );

    }

}


document
    .getElementById("prev-month")
    .addEventListener(
        "click",
        () => {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );

            renderCalendar();

        }
    );


document
    .getElementById("next-month")
    .addEventListener(
        "click",
        () => {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );

            renderCalendar();

        }
    );


/* ============================================
   ANALYTICS
============================================ */

function renderAnalytics() {

    const orders =
        db.orders;


    const completed =
        orders.filter(
            order =>
                order.status ===
                    "Completed" ||
                order.status ===
                    "Paid"
        ).length;


    const revenue =
        orders.reduce(
            (sum, order) =>
                sum +
                Number(order.price || 0),
            0
        );


    const average =
        orders.length
            ? revenue / orders.length
            : 0;


    const paid =
        orders.filter(
            order =>
                order.status === "Paid"
        ).length;


    const conversion =
        orders.length
            ? Math.round(
                (completed /
                    orders.length) *
                    100
            )
            : 0;


    document
        .getElementById(
            "analytics-orders"
        )
        .textContent =
        orders.length;


    document
        .getElementById(
            "analytics-completed"
        )
        .textContent =
        completed;


    document
        .getElementById(
            "analytics-average"
        )
        .textContent =
        money(average);


    document
        .getElementById(
            "analytics-conversion"
        )
        .textContent =
        `${conversion}%`;


    renderRevenueChart();

    renderBestClients();

}


function renderRevenueChart() {

    const chart =
        document.getElementById(
            "revenue-chart"
        );


    const orders =
        [...db.orders]
            .slice(-12);


    if (!orders.length) {

        chart.innerHTML =
            `<div class="empty">
                No revenue data yet.
            </div>`;

        return;

    }


    const max =
        Math.max(
            ...orders.map(
                order =>
                    Number(
                        order.price || 0
                    )
            ),
            1
        );


    chart.innerHTML =
        orders
            .map(
                order => {

                    const height =
                        (
                            Number(order.price || 0) /
                            max
                        ) * 100;


                    return `

                        <div
                            class="chart-bar"
                            style="height:${Math.max(height,5)}%"
                            title="${order.id}: ${money(order.price)}"
                        ></div>

                    `;

                }
            )
            .join("");

}


function renderBestClients() {

    const container =
        document.getElementById(
            "best-clients"
        );


    const ranking =
        db.clients
            .map(
                client => {

                    const spent =
                        db.orders
                            .filter(
                                order =>
                                    order.clientId ===
                                    client.id
                            )
                            .reduce(
                                (sum, order) =>
                                    sum +
                                    Number(order.price || 0),
                                0
                            );


                    return {
                        ...client,
                        spent
                    };

                }
            )
            .sort(
                (a,b) =>
                    b.spent -
                    a.spent
            )
            .slice(0,5);


    if (!ranking.length) {

        container.innerHTML =
            empty(
                "No clients yet",
                "Your best clients will appear here."
            );

        return;

    }


    container.innerHTML =
        ranking
            .map(
                (client,index) => `

                    <div
                        class="order-row"
                        style="grid-template-columns:30px 1fr 90px"
                    >

                        <strong>
                            #${index + 1}
                        </strong>

                        <div>

                            <div class="order-name">
                                ${escapeHTML(client.name)}
                            </div>

                            <div class="order-meta">
                                ${escapeHTML(client.discord)}
                            </div>

                        </div>

                        <strong>
                            ${money(client.spent)}
                        </strong>

                    </div>

                `
            )
            .join("");

}


/* ============================================
   SEARCH
============================================ */

document
    .getElementById(
        "order-search"
    )
    .addEventListener(
        "input",
        renderOrders
    );


document
    .getElementById(
        "status-filter"
    )
    .addEventListener(
        "change",
        renderOrders
    );


document
    .getElementById(
        "client-search"
    )
    .addEventListener(
        "input",
        renderClients
    );


/* ============================================
   GLOBAL SEARCH
============================================ */

document
    .getElementById(
        "search-btn"
    )
    .addEventListener(
        "click",
        () => {

            showPage(
                "orders"
            );

            document
                .getElementById(
                    "order-search"
                )
                .focus();

        }
    );


document.addEventListener(
    "keydown",
    event => {

        if (
            (event.metaKey ||
                event.ctrlKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            document
                .getElementById(
                    "search-btn"
                )
                .click();

        }

    }
);


/* ============================================
   UTILITIES
============================================ */

function generateId(
    prefix
) {

    return (
        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2,7)
    );

}


function generateOrderId() {

    const number =
        db.orders.length + 1;


    return (
        "GARZ-" +
        String(number)
            .padStart(3,"0")
    );

}


function getClient(
    id
) {

    return db.clients.find(
        client =>
            client.id === id
    );

}


function money(
    value
) {

    return (
        "€" +
        Number(
            value || 0
        ).toFixed(2)
    );

}


function formatDate(
    value
) {

    if (!value)
        return "—";


    const date =
        new Date(
            value + "T00:00:00"
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short"
        }
    );

}


function statusBadge(
    status
) {

    const classes = {

        "Inquiry":
            "status-inquiry",

        "Accepted":
            "status-accepted",

        "In Progress":
            "status-progress",

        "Review":
            "status-review",

        "Revisions":
            "status-revisions",

        "Completed":
            "status-completed",

        "Paid":
            "status-paid"

    };


    return `

        <span
            class="status ${classes[status] || ""}"
        >
            ${escapeHTML(status)}
        </span>

    `;

}


function empty(
    title,
    description
) {

    return `

        <div
            style="
                padding:35px;
                text-align:center;
                color:#858c9b;
            "
        >

            <strong
                style="
                    display:block;
                    color:#f5f7fb;
                    margin-bottom:5px;
                    font-size:12px;
                "
            >
                ${title}
            </strong>

            <span
                style="
                    font-size:10px;
                "
            >
                ${description}
            </span>

        </div>

    `;

}


function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* ============================================
   TOAST
============================================ */

let toastTimer;


function toast(
    message,
    error = false
) {

    const element =
        document.getElementById(
            "toast"
        );


    element.textContent =
        message;


    element.style.borderColor =
        error
            ? "rgba(255,91,110,.45)"
            : "rgba(53,208,127,.35)";


    element.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                element.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* ============================================
   RENDER EVERYTHING
============================================ */

function renderAll() {

    renderDashboard();

    renderOrders();

    renderClients();

    renderCalendar();

    renderAnalytics();

}


/* ============================================
   START
============================================ */

renderAll();
