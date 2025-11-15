<template>

  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>User</ion-title>

        <ion-buttons slot="end">
          <ion-button color="danger" @click="logout">Logout</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-buttons slot="end">
          <ion-button color="success" @click="tambah">Tambah Barang</ion-button>
        </ion-buttons>
        <ion-item v-for="user in users" :key="user.id">
          <ion-label>
            <h2>{{ user.nama_barang }}</h2>
            <p>{{ user.stok }}</p>
            <p>{{ Rupiah(user.harga) }}</p>
          </ion-label>

          <!-- Tombol Edit -->
          <ion-button slot="end" color="primary" @click="openEditModal(user)">
            Edit
          </ion-button>

          <!-- Tombol Hapus -->
          <ion-button slot="end" color="danger" @click="deleteUser(user.id)">
            Hapus
          </ion-button>
        </ion-item>
      </ion-list>

      <!-- Modal Edit -->
      <ion-modal v-model:is-open="isEditOpen">
        <ion-header>
          <ion-toolbar>
            <ion-title>Edit User</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="isEditOpen = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-list>
            <ion-item>
              <ion-label position="stacked">Nama Barang</ion-label>
              <ion-input v-model="selectedUser.nama_barang"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Stok Barang</ion-label>
              <ion-input v-model="selectedUser.stok"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Harga</ion-label>
              <ion-input type="Number" v-model="selectedUser.harga"></ion-input>
            </ion-item>
          </ion-list>
          <ion-button expand="block" @click="saveEdit">Simpan</ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>

</template>


<script>

import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonModal, IonInput, IonButtons
} from '@ionic/vue'
import axios from "axios"

export default {
  name: "Tab1Page",
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton, IonModal, IonInput, IonButtons
  },
  data() {
    return {
      users: [],
      isEditOpen: false,
      selectedUser: { id: null, nama_barang: "", stok: "", harga: "" }
    }
  },
  mounted() {
    this.loadUsers()
  },
  methods: {
    Rupiah(angka) {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(angka);
  },
  
    async loadUsers() {
      try {
        const res = await axios.get("http://localhost:3000/barang")
        this.users = res.data
      } catch (err) {
        console.error("Gagal load barang:", err)
      }
    },
    async deleteUser(id) {
      const konfirmasi = confirm("Yakin hapus barang ini?")
      if (!konfirmasi) {
        return;
      }
      try {
        await axios.delete(`http://localhost:3000/barang/${id}`);
    alert("Barang berhasil dihapus!");
    this.loadUsers(); 
  } catch (err) {
    console.error("Gagal hapus user:", err);
    alert("Terjadi kesalahan saat menghapus data.");
  }
    },
    openEditModal(user) {
      this.selectedUser = { ...user } 
      this.isEditOpen = true
    },
    async saveEdit() {
      try {
        const { id, nama_barang, stok, harga } = this.selectedUser
        await axios.put(`http://localhost:3000/barang/${id}`, { nama_barang, stok, harga })
        console.log("barang diupdate")
        this.isEditOpen = false
        this.loadUsers()
      } catch (err) {
        console.error("Gagal update barang:", err)
      }
    },
    logout () {
      this.$router.push("/tabs/tab2")
    },
    tambah () {
      this.$router.push("/tabs/tab3")
  }
  }
}


</script>