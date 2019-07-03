<template>
  <v-dialog width="400px" v-model="dialog">
    <v-btn outline large slot="activator">Логин</v-btn>

    <v-card>
      <v-container>
        <v-layout row>
          <v-flex xs12>
            <v-card-title>
              <h1 class="text--primary">Войти в систему</h1>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row>
          <v-flex xs12>
            <v-card-text>
              <v-form
                v-model="valid"
                ref="form"
                lazy-validation
              >
                <v-text-field
                  prepend-icon="person"
                  name="username"
                  label="User Name"
                  type="text"
                  v-model="username"
                >
                </v-text-field>
                <v-text-field
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  type="password"
                  counter
                  v-model="password"
                  :rules="passwordRules"
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row>
          <v-flex xs12>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="success" flat @click="onSubmit">Войти</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      username: '',
      password: '',
      valid: false,
      dialog: false,
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be equal or more than 6 characters'
      ]
    }
  },
  methods: {
    ...mapActions(['login']),
    async onSubmit () {
      if (this.$refs.form.validate()) {
        await this.login({ username: this.username, password: this.password })
        this.dialog = false
      }
    }
  }
}
</script>
