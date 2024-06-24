<template>
  <div class="h-screen flex items-center justify-center bg-gray-100"> 
    <div class="w-full">
      <div>
        <h1 class="text-4xl text-center">
          {{message[curentindex]}}
        </h1>
      </div>
      <Carousel3d
        ref="carousel"
        :perspective="35"
        :animationSpeed="500"
        :height="450"
        :controlsVisible="true"
        :border="1"
        :space="500"
        :checkable="true"
        class="bg-transparent"
        @before-slide-change="handleSlideChange"
        @handleslide="handleSlideChange"
        :on-main-slide-click="test"
      >
      <Slide :index="0" class="">
        <login />
      </Slide>
      <Slide :index="1">
        <register />
      </Slide>
      <Slide :index="2">
        <quickstart />
      </Slide>
    </Carousel3d>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue'
import DynamicForm from '@/components/cover/DynamicForm.vue'
import { mail_login } from '@/functions/auth'
import { Carousel3d, Slide } from '@nanoandrew4/vue3-carousel-3d';
import login from '@/components/login/login.vue'
import register from '@/components/login/register.vue'
import quickstart from '@/components/login/quickstart.vue'

const carousel = ref(null);
const curentindex = ref(0)
const message = ref(['Login', 'Register', 'QuickStart'])

watch(curentindex, (val) => {
  console.log(val)
})

const test = () => {
  console.log(curentindex.value)
  if (curentindex.value === 0) {
    window.location.href = '/login'
  } else if (curentindex.value === 1) {
    window.location.href = '/register'
  } else {
    window.location.href = '/quickstart'
  }
}

const handleSlideChange = (index) => {
  console.log(index)
  curentindex.value = index
  carousel.value.goFar(index)
  curentindex.value = index
}
</script>
