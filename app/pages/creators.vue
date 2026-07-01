<script setup lang="ts">
interface Creator {
    avatar: string;
    alt: string;
    name: string;
    thanks: string;
}

const creators: Creator[] = [
    {
        avatar: "fruitsnack.png",
        alt: "fruitsnack",
        name: "Fruitsnack",
        thanks: "Massive thanks for all the help with the Skylanders image assets and the ongoing support throughout the project!",
    },
    {
        avatar: "green.png",
        alt: "cha0s",
        name: "Cha0s",
        thanks: "Thank you for your amazing contributions on round covers for Spyro and Giants!",
    },
    {
        avatar: "dimspace.png",
        alt: "dimspace",
        name: "Dim",
        thanks: "Thanks for all your great help with villain covers for Trap Team!",
    },
    {
        avatar: "mirakel.png",
        alt: "mirakel",
        name: "Mirakel",
        thanks: "Thanks for your amazing work on round covers for all of the games!",
    },
    {
        avatar: "mr_red_shadow.png",
        alt: "mr_red_shadow",
        name: "Mr Shadow",
        thanks: "Thank you for creating amazing card image assets for all the games!",
    },
    {
        avatar: "shizzy.png",
        alt: "shizzy",
        name: "Shizzy",
        thanks: "Thanks for all your hard work on the round covers for Imaginators!",
    },
    {
        avatar: "skylandersnfc.png",
        alt: "skylandersnfc",
        name: "SkylandersNFC",
        thanks: "I don’t know this guy. Rumor has it he’s a quite weird.",
    },
    {
        avatar: "yellow.png",
        alt: "sobersu",
        name: "Sobersu",
        thanks: "Thank you for covering almost all the games with highly detailed covers for cards and coins.",
    },
    {
        avatar: "blue.png",
        alt: "Adri-Dani",
        name: "Adri-Dani",
        thanks: "Thanks for your fantastic work on custom artwork and covers that bring extra polish to the collection!",
    },
    {
        avatar: "green.png",
        alt: "Adrian",
        name: "Adrian",
        thanks: "Thanks for your creative contributions and for helping expand the collection with fresh assets!",
    },
    {
        avatar: "grey.png",
        alt: "AlexDTI",
        name: "AlexDTI",
        thanks: "Big thanks for your creative contributions and attention to detail on game assets!",
    },
    {
        avatar: "red.png",
        alt: "LenLen",
        name: "LenLen",
        thanks: "Thank you for your awesome effort in making unique, high-quality covers and images!",
    },
    {
        avatar: "yellow.png",
        alt: "Cendrillion",
        name: "Cendrillion",
        thanks: "Thanks for adding your artistic touch to the project and helping keep the style consistent!",
    },
    {
        avatar: "blue.png",
        alt: "IndominusRex",
        name: "IndominusRex",
        thanks: "Huge thanks for your impressive designs and for expanding the collection with great quality!",
    },
    {
        avatar: "grey.png",
        alt: "Mejoe",
        name: "Mejoe",
        thanks: "Thanks for your great work on covers and images - it’s a huge help for completing the sets!",
    },
];

useHead({
    title: "Skylanders Image Assets Creators",
    htmlAttrs: { "data-page": "creators" },
});

const router = useRouter();
function goBack() {
    if (import.meta.client && window.history.length > 1) router.back();
    else router.push("/spyro");
}
</script>

<template>
    <div>
        <header>
            <h1>Skylanders Image Assets Creators</h1>
        </header>

        <ul>
            <a href="#" @click.prevent="goBack">Back</a>
        </ul>

        <div class="project-note">
            <p>
                This site is a fork of the
                <a
                    href="https://github.com/skylandersnfc/Skylanders-Image-Generator"
                    target="_blank"
                    rel="noopener"
                    >SkylandersNFC Image Generator</a
                >
                project. Huge thanks to the SkylandersNFC project and everyone
                behind it for creating and sharing the original generator and
                image assets that make all of this possible.
            </p>
            <p>Parts of this fork were written with AI</p>
        </div>

        <div class="creators">
            <div v-for="c in creators" :key="c.name" class="creator-item">
                <img
                    :src="`/images/avatars/${c.avatar}`"
                    :alt="c.alt"
                    class="creator-avatar"
                />
                <div class="creator-text">
                    <div class="creator-name">{{ c.name }}</div>
                    <div class="creator-thanks">{{ c.thanks }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.project-note {
    max-width: 600px;
    margin: 30px auto;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 20px;
    color: #fff;
    font:
        15px/1.5 Arial,
        sans-serif;
    text-align: center;
}

.project-note p {
    margin: 0 0 10px;
}

.project-note p:last-child {
    margin-bottom: 0;
}

.project-note a {
    color: #1888c8;
    text-decoration: underline;
}
</style>
