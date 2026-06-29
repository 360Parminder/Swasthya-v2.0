const fs = require('fs');

const file = './src/screens/notifications/NotificationsScreen.jsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace('const colors = useThemeColors();', 'const colors = useThemeColors();\n  const styles = React.useMemo(() => getStyles(colors), [colors]);');

data = data.replace('const styles = StyleSheet.create({', 'const getStyles = (colors) => StyleSheet.create({');

data = data.replace(/#FFFFFF/g, 'colors.background'); // Will manually fix those inside icons later
data = data.replace(/color: colors.background/g, 'color: colors.buttonText'); // Undo icons
data = data.replace(/backgroundColor: colors.background/g, "backgroundColor: colors.background"); // ok

// Do manual string replace
const replacements = [
  ["backgroundColor: '#FFFFFF',", "backgroundColor: colors.background,"],
  ["color: '#1E293B',", "color: colors.text,"],
  ["backgroundColor: '#0F766E',", "backgroundColor: colors.primary,"],
  ["color: '#94A3B8',", "color: colors.textSecondary,"],
  ["color: '#64748B',", "color: colors.textSecondary,"],
  ["backgroundColor: '#EF4444',", "backgroundColor: colors.danger,"],
  ["backgroundColor: '#3B82F6',", "backgroundColor: colors.info,"],
  ["borderColor: '#E2E8F0',", "borderColor: colors.border,"],
];

for (let [oldStr, newStr] of replacements) {
    data = data.split(oldStr).join(newStr);
}

// Ensure card background
data = data.replace(
`  notifCard: {
    backgroundColor: colors.background,
    borderRadius: 16,`,
`  notifCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,`
);

fs.writeFileSync(file, data, 'utf8');
