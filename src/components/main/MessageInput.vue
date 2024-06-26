<template>
  <footer
    class="bg-white p-4 shadow-lg flex items-center"
    @drop.prevent="handleDrop"
    @dragover.prevent
  >
    <div v-if="previewImages.length" class="flex mb-2">
      <img
        v-for="(image, index) in previewImages"
        :key="index"
        :src="image"
        class="w-20 h-20 object-cover rounded-lg mr-2"
      />
    </div>
    <a-textarea
      id="textarea"
      v-model:value="messageText"
      placeholder="Type a message"
      :auto-size="{ minRows: 1, maxRows: 5 }"
      @keydown.enter="handleEnter"
    />
    <div class="flex items-center mx-2">
      <button
        v-if="bingo_icon"
        @click="sendBingoInvitation"
        class="bg-yellow-500 text-white px-2 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
      ></button>
      <V3Emoji @click-emoji="appendEmoji" class="ml-2" />
    </div>
    <button
      @click="sendMessage"
      class="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
    >
      Send
    </button>
  </footer>
</template>

<script setup>
import { ref, defineEmits, watch } from 'vue'
import V3Emoji from 'vue3-emoji'
import 'vue3-emoji/dist/style.css'

const props = defineProps({
  chatroomid: Number
})

watch(
  () => props.chatroomid,
  (id) => {
    console.log(id)
    bingo_icon.value = id === -1 ? false : true
  }
)

const emit = defineEmits(['sendMessage', 'sendBingoInvitation'])
const messageText = ref('')
const previewImages = ref([])
const bingo_icon = ref(props.chatroomid === -1 ? false : true)

const sendMessage = () => {
  const trimmedMessage = messageText.value.trim()
  const images = previewImages.value

  if (trimmedMessage || images.length) {
    const message = {
      id: Date.now(),
      text: trimmedMessage,
      image: images.length ? images : null,
      sender: 'me',
      timestamp: new Date().toISOString()
    }
    messageText.value = ''
    previewImages.value = []
    emit('sendMessage', message)
  }
}

const appendEmoji = (emoji) => {
  const myField = document.querySelector('#textarea')
  const startPos = myField.selectionStart
  const endPos = myField.selectionEnd

  // 使用消息文本而不是直接操作DOM
  messageText.value = messageText.value.slice(0, startPos) + emoji + messageText.value.slice(endPos)

  // 更新光标位置
  setTimeout(() => {
    myField.setSelectionRange(startPos + emoji.length, startPos + emoji.length)
  }, 0)
}

const sendBingoInvitation = () => {
  emit('sendBingoInvitation')
}

const handleEnter = (event) => {
  if (event.shiftKey) {
    return
  }
  event.preventDefault()
  sendMessage()
}

const handleDrop = (event) => {
  const files = event.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImages.value.push(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
}
</script>

<style scoped>
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}
</style>
