import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  Brain, 
  BarChart3,
  User,
  LogOut,
  Settings,
  Star,
  AlertCircle,
  TrendingUp,
  Target
} from 'lucide-react';

// Importar Firebase

import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';


// Componente de Autenticación con Firebase
const AuthComponent = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Login exitoso:', userCredential.user);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Registro exitoso:', userCredential.user);
      }

      // El callback se ejecutará automáticamente por onAuthStateChanged
    } catch (error) {
      console.error('Error de autenticación:', error);
      
      // Manejar errores específicos de Firebase
      let errorMessage = 'Error de autenticación';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Este email ya está registrado';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Zen Task</h1>
          <p className="text-gray-600 mt-2">Gestor de tareas inteligente</p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="tu@email.com"
              required
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Cargando...</span>
              </div>
            ) : (
              isLogin ? 'Iniciar Sesión' : 'Registrarse'
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setEmail('');
              setPassword('');
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
            disabled={loading}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook para simulación de IA
const useAI = () => {
  const analyzePriority = (task) => {
    const urgentKeywords = ['urgente', 'importante', 'hoy', 'ahora', 'crítico'];
    const hasUrgentKeyword = urgentKeywords.some(keyword => 
      task.title.toLowerCase().includes(keyword) || 
      task.description.toLowerCase().includes(keyword)
    );
    
    if (hasUrgentKeyword) return 'high';
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) return 'high';
      if (diffDays <= 3) return 'medium';
    }
    return 'low';
  };

  const generateSuggestions = (tasks) => {
    const completedToday = tasks.filter(t => 
      t.completed && new Date(t.completedAt).toDateString() === new Date().toDateString()
    ).length;
    
    const overdueTasks = tasks.filter(t => 
      !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length;

    const suggestions = [];
    
    if (completedToday >= 5) {
      suggestions.push("🎉 ¡Excelente día! Has completado muchas tareas.");
    }
    
    if (overdueTasks > 0) {
      suggestions.push(`⚠️ Tienes ${overdueTasks} tarea(s) vencida(s). Considera reorganizar tu tiempo.`);
    }
    
    const highPriorityPending = tasks.filter(t => !t.completed && t.priority === 'high').length;
    if (highPriorityPending > 3) {
      suggestions.push("🔥 Muchas tareas de alta prioridad. Considera delegar o dividir tareas grandes.");
    }

    return suggestions;
  };

  return { analyzePriority, generateSuggestions };
};

// Componente principal de la aplicación
const TaskFlowApp = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [filter, setFilter] = useState('all');
  const [showStats, setShowStats] = useState(false);
  const { analyzePriority, generateSuggestions } = useAI();

  // Listener de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Cargar datos cuando el usuario esté autenticado
  useEffect(() => {
    if (!user) return;
  
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(userTasks);
    });
  
    return () => unsubscribe();
  }, [user]);

  // Loading inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700">Cargando...</span>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, mostrar componente de autenticación
  if (!user) {
    return <AuthComponent />;
  }

  const addTask = async () => {
    if (!newTask.title.trim()) return;
  
    const task = {
      ...newTask,
      completed: false,
      priority: analyzePriority(newTask),
      createdAt: new Date().toISOString(),
      uid: user.uid, // 🔐 Associem la tasca a l'usuari autenticat
    };
  
    try {
      await addDoc(collection(db, "tasks"), task);
      setNewTask({ title: '', description: '', dueDate: '' });
    } catch (err) {
      console.error("Error afegint tasca:", err);
    }
  };

  const toggleTask = async (task) => {
    try {
      await updateDoc(doc(db, "tasks", task.id), {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null,
      });
    } catch (err) {
      console.error("Error marcant tasca:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (err) {
      console.error("Error esborrant tasca:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // El estado se actualizará automáticamente por onAuthStateChanged
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    if (filter === 'high') return task.priority === 'high' && !task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length
  };

  const suggestions = generateSuggestions(tasks);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <Target className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Zen Task</h1>
              <p className="text-sm text-gray-600">Hola, {user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Estadísticas</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Panel de estadísticas */}
        {showStats && (
          <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Análisis de Productividad
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total de tareas</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completadas</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
                <div className="text-sm text-gray-600">Alta prioridad</div>
              </div>
            </div>

            {/* Sugerencias de IA */}
            {suggestions.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  Sugerencias de IA
                </h3>
                <ul className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="text-purple-700 text-sm">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de creación de tareas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Nueva Tarea
              </h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Título de la tarea"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
                
                <textarea
                  placeholder="Descripción (opcional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none text-black"
                />
                
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
                
                <button
                  onClick={addTask}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Agregar Tarea</span>
                </button>
              </div>
            </div>
          </div>

          {/* Lista de tareas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Mis Tareas</h2>
                
                {/* Filtros */}
                <div className="flex space-x-2">
                  {[
                    { key: 'all', label: 'Todas' },
                    { key: 'pending', label: 'Pendientes' },
                    { key: 'completed', label: 'Completadas' },
                    { key: 'high', label: 'Alta prioridad' }
                  ].map(filterOption => (
                    <button
                      key={filterOption.key}
                      onClick={() => setFilter(filterOption.key)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filter === filterOption.key
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filterOption.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de tareas */}
              <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Circle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay tareas para mostrar</p>
                  </div>
                ) : (
                  filteredTasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                        task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => toggleTask(task)}
                          className={`mt-1 transition-colors ${
                            task.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                          }`}
                        >
                          {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-medium ${
                              task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                            }`}>
                              {task.title}
                            </h3>
                            
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${
                                getPriorityColor(task.priority)
                              }`}>
                                {getPriorityIcon(task.priority)}
                                <span className="capitalize">{task.priority}</span>
                              </span>
                              
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className={`text-sm mb-2 ${
                              task.completed ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {task.description}
                            </p>
                          )}
                          
                          {task.dueDate && (
                            <div className={`flex items-center space-x-1 text-xs ${
                              task.completed ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <Calendar className="w-3 h-3" />
                              <span>Vence: {new Date(task.dueDate).toLocaleDateString('es-ES')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFlowApp;