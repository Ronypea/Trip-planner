<template>
  <v-dialog width="400px" v-model="dialog">
    <v-btn outline slot="activator" block>Редактировать</v-btn>
    <v-card>
      <v-container>
        <v-layout row>
          <v-flex xs12>
            <v-card-title>
              <h1 class="text--primary">Редактировать профиль</h1>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="name"
                label="ФИО"
                type="text"
                v-model="User.Fio">
              </v-text-field>
              <v-text-field
                name="description"
                label="Описание"
                type="text"
                multi-line
                v-model="User.Info">
              </v-text-field>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row>
          <v-flex xs12>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click="close()">Отмена</v-btn>
              <v-btn class="success" flat @click="onSave">Сохранить</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>import Service from '../../../services/Service'

export default {
  data() {
    return {
      User: {
        Fio: '',
        Info: ''
      },
      OldInfo: '',
      dialog: false
    }
  },
  methods: {
    async onSave() {
      await Service.EditProfile({
        Fio: this.User.Fio,
        Info: this.User.Info,
      })
      this.$emit('profile-updated')
      this.dialog = false
      this.$emit('close')
    },
    close () {
      this.dialog = false
      this.$emit('close')
    },
  }
}
</script>
