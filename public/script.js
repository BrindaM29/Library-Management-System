function showSection(sectionName) {

    const sections = [
        "dashboard",
        "books",
        "members",
        "issue",
        "return"
    ];

    sections.forEach(section => {
        document.getElementById(section).classList.add("hidden");
    });

    document
        .getElementById(sectionName)
        .classList.remove("hidden");
}