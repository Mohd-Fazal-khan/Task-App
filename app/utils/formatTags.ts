import Colors from "../constants/Colors";

export const formatTags = (tags = []) =>
  tags.map((tag) => ({
    text: tag,
    color:
      tag === "Personal"
        ? Colors.tagPersonal
        : tag === "App"
        ? Colors.tagApp
        : tag === "Work"
        ? Colors.tagWork
        : tag === "CF"
        ? Colors.tagCF
        : tag === "Study"
        ? Colors.tagStudy
        : tag === "Home"
        ? Colors.tagHome
        : Colors.primaryPurple,
  }));
