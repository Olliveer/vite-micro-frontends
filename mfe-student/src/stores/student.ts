import { defineStore } from "pinia";

/**
 * Store de estudante.
 */
export const useStudentStore = defineStore("student", {
  state: () => ({
    courses: [] as Array<{ id: string; name: string; grade: number }>,
    currentCourseId: null as string | null,
    gpa: 0,
  }),

  getters: {
    currentCourse: (state) =>
      state.courses.find((c) => c.id === state.currentCourseId),
    totalCourses: (state) => state.courses.length,
    averageGrade: (state) => {
      if (state.courses.length === 0) return 0;
      return state.courses.reduce((sum, c) => sum + c.grade, 0) / state.courses.length;
    },
  },

  actions: {
    setCourses(courses: Array<{ id: string; name: string; grade: number }>) {
      this.courses = courses;
      this.calculateGpa();
    },

    selectCourse(id: string | null) {
      this.currentCourseId = id;
    },

    addCourse(course: { id: string; name: string; grade: number }) {
      this.courses.push(course);
      this.calculateGpa();
    },

    calculateGpa() {
      if (this.courses.length === 0) {
        this.gpa = 0;
        return;
      }
      const total = this.courses.reduce((sum, c) => sum + c.grade, 0);
      this.gpa = total / this.courses.length;
    },
  },
});
