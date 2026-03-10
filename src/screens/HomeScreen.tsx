import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  StatusBar, Modal, TextInput, Alert, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useProjectStore } from '../store/projectStore';
import { Project } from '../types/index';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type TabType = 'home' | 'templates' | 'tutorials' | 'settings';

const { width: SW } = Dimensions.get('window');

const TEMPLATES = [
  { id: '1', icon: '⚡', label: 'Auto-Sync', sub: 'Beats-to-video', color: '#ec4899', bg: '#ec489920' },
  { id: '2', icon: '🎬', label: 'Vlog Prep', sub: 'Transitions ready', color: '#10b981', bg: '#10b98120' },
  { id: '3', icon: '✨', label: 'Cinematic', sub: 'LUT included', color: '#f59e0b', bg: '#f59e0b20' },
  { id: '4', icon: '📱', label: 'Reels/Shorts', sub: '9:16 vertical', color: '#8b5cf6', bg: '#8b5cf620' },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNav>();
  const { projects, createProject, deleteProject, openProject } = useProjectStore();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [modalVisible, setModalVisible] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleCreate = () => {
    if (!projectName.trim()) return;
    const project = createProject(projectName.trim());
    setProjectName('');
    setModalVisible(false);
    navigation.navigate('Editor', { projectId: project.id });
  };

  const handleOpen = (project: Project) => {
    openProject(project.id);
    navigation.navigate('Editor', { projectId: project.id });
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Project', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteProject(id) },
    ]);
  };

  const timeAgo = (ms: number) => {
    const diff = Date.now() - ms;
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (h < 1) return 'Just now';
    if (h < 24) return h + 'h ago';
    if (d === 1) return 'Yesterday';
    return d + ' days ago';
  };

  const renderHome = () => (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Create Card */}
      <TouchableOpacity style={s.createCard} onPress={() => setModalVisible(true)} activeOpacity={0.92}>
        <View style={s.createIconWrap}>
          <Text style={s.createIconText}>+</Text>
        </View>
        <Text style={s.createTitle}>Create New Project</Text>
        <Text style={s.createSub}>Import videos, audio, photos or start fresh</Text>
      </TouchableOpacity>

      {/* Recent Projects */}
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Recent Projects</Text>
        <TouchableOpacity><Text style={s.sectionAction}>View All</Text></TouchableOpacity>
      </View>

      {projects.length === 0 ? (
        <View style={s.emptyProjects}>
          <Text style={s.emptyIcon}>🎬</Text>
          <Text style={s.emptyText}>No projects yet</Text>
          <Text style={s.emptySubText}>Create your first project above</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.projectsRow}>
          {projects.map(p => (
            <TouchableOpacity key={p.id} style={s.projectCard} onPress={() => handleOpen(p)}>
              <View style={s.projectThumb}>
                <Text style={s.projectThumbLetter}>{p.name.charAt(0).toUpperCase()}</Text>
                <View style={s.projectDuration}>
                  <Text style={s.projectDurationText}>{(p.duration / 1000).toFixed(0)}s</Text>
                </View>
              </View>
              <View style={s.projectInfo}>
                <Text style={s.projectName} numberOfLines={1}>{p.name}</Text>
                <Text style={s.projectDate}>{timeAgo(p.updatedAt)}</Text>
              </View>
              <TouchableOpacity style={s.projectDelete} onPress={() => handleDelete(p.id)}>
                <Text style={s.projectDeleteText}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Templates */}
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Quick Start Templates</Text>
      </View>
      <View style={s.templatesGrid}>
        {TEMPLATES.map(t => (
          <TouchableOpacity key={t.id} style={s.templateCard} activeOpacity={0.8}>
            <View style={[s.templateIcon, { backgroundColor: t.bg }]}>
              <Text style={s.templateIconText}>{t.icon}</Text>
            </View>
            <Text style={s.templateLabel}>{t.label}</Text>
            <Text style={s.templateSub}>{t.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderPlaceholder = (label: string) => (
    <View style={s.placeholder}>
      <Text style={s.placeholderText}>{label}</Text>
      <Text style={s.placeholderSub}>Coming soon</Text>
    </View>
  );

  const TABS: { key: TabType; label: string; icon: string }[] = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'templates', label: 'Templates', icon: '⚡' },
    { key: 'tutorials', label: 'Tutorials', icon: '▶' },
    { key: 'settings', label: 'Settings', icon: '⚙' },
  ];

  return (
    <View style={s.container}>
      <StatusBar barStyle='light-content' backgroundColor='#0f0f0f' />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.logo}>OpenCut</Text>
          <Text style={s.logoSub}>CREATIVE STUDIO</Text>
        </View>
        <View style={s.headerActions}>
          <TouchableOpacity style={s.headerBtn}>
            <Text style={s.headerBtnIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.headerBtn}>
            <Text style={s.headerBtnIcon}>🔔</Text>
            <View style={s.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'templates' && renderPlaceholder('Templates')}
        {activeTab === 'tutorials' && renderPlaceholder('Tutorials')}
        {activeTab === 'settings' && renderPlaceholder('Settings')}
      </View>

      {/* Bottom Nav */}
      <View style={s.bottomNav}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab.key} style={s.navItem} onPress={() => setActiveTab(tab.key)}>
            <Text style={[s.navIcon, activeTab === tab.key && s.navIconActive]}>{tab.icon}</Text>
            <Text style={[s.navLabel, activeTab === tab.key && s.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* New Project Modal */}
      <Modal visible={modalVisible} transparent animationType='fade' onRequestClose={() => setModalVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>New Project</Text>
            <Text style={s.modalSub}>Give your project a name to get started</Text>
            <TextInput
              style={s.modalInput}
              placeholder='e.g. Summer Vlog 2025'
              placeholderTextColor='#444'
              value={projectName}
              onChangeText={setProjectName}
              autoFocus
            />
            <View style={s.modalActions}>
              <TouchableOpacity style={s.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={s.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalConfirm} onPress={handleCreate}>
                <Text style={s.modalConfirmText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  scroll: { flex: 1, paddingHorizontal: 20 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16 },
  logo: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  logoSub: { fontSize: 9, color: '#555', letterSpacing: 3, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 10 },
  headerBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
  headerBtnIcon: { fontSize: 16 },
  notifDot: { position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: '#3b82f6', borderWidth: 1.5, borderColor: '#0f0f0f' },

  // Create Card
  createCard: {
    borderRadius: 24, padding: 28, marginVertical: 16,
    alignItems: 'center', justifyContent: 'center',
    minHeight: SW * 0.5,
    backgroundColor: '#1a1a2e',
    borderWidth: 1, borderColor: '#3b82f630',
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 24,
    elevation: 12,
  },
  createIconWrap: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#ffffff25', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  createIconText: { fontSize: 32, color: '#fff', fontWeight: '300', lineHeight: 36 },
  createTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 6 },
  createSub: { fontSize: 13, color: '#93c5fd', textAlign: 'center', lineHeight: 18 },

  // Section headers
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  sectionAction: { fontSize: 13, color: '#60a5fa', fontWeight: '600' },

  // Recent Projects
  projectsRow: { paddingRight: 20, gap: 14 },
  projectCard: { width: 160, backgroundColor: '#161616', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#ffffff08' },
  projectThumb: { width: '100%', aspectRatio: 4/5, backgroundColor: '#1e1e2e', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  projectThumbLetter: { fontSize: 48, color: '#3b82f660', fontWeight: '800' },
  projectDuration: { position: 'absolute', bottom: 8, right: 8, backgroundColor: '#00000080', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  projectDurationText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  projectInfo: { padding: 10, paddingRight: 32 },
  projectName: { fontSize: 13, fontWeight: '600', color: '#fff' },
  projectDate: { fontSize: 11, color: '#555', marginTop: 2 },
  projectDelete: { position: 'absolute', bottom: 10, right: 10, padding: 4 },
  projectDeleteText: { color: '#444', fontSize: 12 },

  // Empty state
  emptyProjects: { alignItems: 'center', paddingVertical: 32, backgroundColor: '#161616', borderRadius: 18, borderWidth: 1, borderColor: '#ffffff08' },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  emptySubText: { fontSize: 12, color: '#444', marginTop: 4 },

  // Templates
  templatesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  templateCard: { width: (SW - 52) / 2, backgroundColor: '#161616', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#ffffff08', gap: 10 },
  templateIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  templateIconText: { fontSize: 22 },
  templateLabel: { fontSize: 14, fontWeight: '600', color: '#fff' },
  templateSub: { fontSize: 11, color: '#555', marginTop: -6 },

  // Placeholder
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  placeholderText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  placeholderSub: { fontSize: 14, color: '#444', marginTop: 8 },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row', height: 80, paddingHorizontal: 20,
    alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#121212cc',
    borderTopWidth: 1, borderTopColor: '#ffffff0d',
  },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIcon: { fontSize: 22, opacity: 0.4 },
  navIconActive: { opacity: 1 },
  navLabel: { fontSize: 10, color: '#555', fontWeight: '500' },
  navLabelActive: { color: '#60a5fa' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: '#000000bb', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox: { backgroundColor: '#161616', borderRadius: 24, padding: 24, width: '100%', borderWidth: 1, borderColor: '#2a2a2a' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 6 },
  modalSub: { fontSize: 13, color: '#555', marginBottom: 20 },
  modalInput: { backgroundColor: '#0f0f0f', borderRadius: 14, padding: 16, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2a2a2a', marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancel: { flex: 1, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#2a2a2a', alignItems: 'center' },
  modalCancelText: { color: '#666', fontWeight: '600', fontSize: 15 },
  modalConfirm: { flex: 1, padding: 14, borderRadius: 14, backgroundColor: '#3b82f6', alignItems: 'center' },
  modalConfirmText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});