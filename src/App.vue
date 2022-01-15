<template>
  <DataView />
  <Menu />
</template>

<script>
import DataView from './components/DataView.vue'
import Menu from './components/Menu.vue'

export default {
  name: 'App',
  components: {
    DataView,
    Menu
  }
}
</script>