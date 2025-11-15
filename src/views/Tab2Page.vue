<template>

  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-input v-model="email" placeholder="Email"></ion-input>
      <ion-input v-model="password" type="password" placeholder="Password"></ion-input>
      <ion-button expand="block" @click="login">Login</ion-button>
      <p>{{ message }}</p>
    </ion-content>
  </ion-page>

</template>


<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/vue'
import axios from "axios"

export default {
  name: "Tab2Page",
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton },
  data() {
    return {
      email: "",
      password: "",
      message: ""
    }
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        alert("Email dan password tidak boleh kosong!");
        return;
      }

      try {
        const res = await axios.post("http://localhost:3000/login", {
          email: this.email,
          password: this.password
        });

        if (res.data.success) {
          // ✅ Simpan token di localStorage
          localStorage.setItem("token", res.data.token);

          // ✅ Simpan juga data user (opsional)
          localStorage.setItem("user", JSON.stringify(res.data.user));

          alert("Login berhasil!");

          // Arahkan ke halaman utama (Tab1)
          this.$router.push("/tabs/tab1");
        } else {
          alert(res.data.message || "Email atau password salah!");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Gagal login! Pastikan server berjalan.");
      }
    }
  }
}
</script>

