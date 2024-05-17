<script setup lang="ts">
import { ref, toRefs, watch } from "vue"
import { supabase } from "../lib/supabase"

const props = defineProps<{
  path: string;
}>()

const emit = defineEmits<{
    // nombre del evento, Payload dato
    (event: 'upload'): void;
    (event: 'update:path', filePath: string): void;
}>()

// setup(props, { emits }) {
const { path } = toRefs(props)
const size = ref("10em")
const uploading = ref(false)
const src = ref("")
const files = ref<FileList | null>(null);


const downloadImage = async () => {
  try {
    const { data, error } = await supabase
      .storage
      .from("avatars")
      .download(path.value)
    if (error) throw error
    src.value = URL.createObjectURL(data)
  } catch (error) {
  if (error instanceof Error) {
    console.error("Error downloading image: ", error.message);
  } else {
    console.error("Unknown error downloading image");
  }
}
}

const uploadAvatar = async (evt: Event) => {
  const target = evt.target as HTMLInputElement;
  files.value = target.files;
  try {
    uploading.value = true
    if (!files.value || files.value.length === 0) {
      throw new Error("You must select an image to upload.")
    }

    const file = files.value[0]
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    let { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file)

    if (uploadError) throw uploadError
    emit("update:path", filePath)
    emit("upload")
  } catch (error) {
  if (error instanceof Error) {
    alert(error.message);
  } else {
    alert("Unknown error uploading file");
  }
}

}

watch(path, () => {
  path.value ? downloadImage() : ""
})
</script>
<template>
  <div>
    <img
      v-if="src"
      :src="src"
      alt="Avatar"
      class="avatar image"
      :style="{ height: size, width: size }"
    />
    <div
      v-else
      class="avatar no-image"
      :style="{ height: size, width: size }"
    >
    </div>
    <div :style="{ width: size }">
      <label class="button primary block" for="single">
        {{ uploading ? "Uploading ..." : "Upload" }}
      </label>
      <input
        style="visibility: hidden; position: absolute"
        type="file"
        id="single"
        accept="image/*"
        @change="uploadAvatar"
        :disabled="uploading"
      />
    </div>
  </div>
</template>

