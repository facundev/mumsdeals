<template>
    <div>
        <nav class="navbar navbar-dark bg-dark p-2">
            <a :href="item.link" class="navbar-brand" v-for="item of itemsMenu" :key="item.id"><strong>{{ item.description }}</strong></a>
        </nav>
    </div>
</template>

<script>
export default {
    name: "Menu",
    data() {
        return {
            itemsMenu: [
                {
                    id: 1,
                    description: "Home",
                    link: "/"
                    },
                {
                    id: 2,
                    description: "Products",
                    link: "/Products"
                },
                {
                    id: 3,
                    description: "Categories",
                    link: "/Categories"
                },
                {
                    id: 4,
                    description: "Contact",
                    link: "/Contact"
                },
                {
                    id: 5,
                    description: "About Us",
                    link: "/Aboutus"
                },
            ]
        }
    }
}
</script>