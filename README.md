\documentclass[a4paper,12pt]{article}

\usepackage{amsmath, amssymb}
\usepackage[greek]{babel}
\usepackage{geometry}
\geometry{margin=2.5cm}

\title{Ηλεκτρική Ταλάντωση}
\author{}
\date{}

\begin{document}

\maketitle

\section*{Περιγραφή}

Η εφαρμογή προσομοιώνει την κατακόρυφη κίνηση ενός σημειακού φορτίου \( q \) υπό την επίδραση:

\begin{itemize}
\item της ηλεκτρικής δύναμης Coulomb από φορτίο \( Q \)
\item του βάρους
\end{itemize}

Το σύστημα παρουσιάζει ταλαντωτική κίνηση γύρω από θέση ισορροπίας.

---

\section*{Παιδαγωγικός στόχος}

Η προσομοίωση επιτρέπει στον μαθητή να:

\begin{itemize}
\item κατανοήσει τη θέση ισορροπίας
\item δει την αλληλεπίδραση δυνάμεων
\item συνδέσει ενέργεια και κίνηση
\item παρατηρήσει σημεία καμπής (άκρα)
\item μελετήσει μη αρμονική ταλάντωση
\end{itemize}

---

\section*{Φυσικό μοντέλο}

\subsection*{Δυνάμεις}

Η ηλεκτρική δύναμη:

\[
F_c = \frac{k Q q}{r^2}
\]

Το βάρος:

\[
F_w = mg
\]

Συνολική δύναμη:

\[
F = \frac{k Q q}{r^2} - mg
\]

---

\subsection*{Θέση ισορροπίας}

\[
\frac{k Q q}{r^2} = mg
\]

άρα:

\[
r_{\text{eq}} = \sqrt{\frac{k Q q}{m g}}
\]

---

\subsection*{Δυναμική ενέργεια}

\[
U(r) = mg r + \frac{k Q q}{r}
\]

---

\subsection*{Ολική ενέργεια}

Για αρχική απόσταση \( d \):

\[
E = mgd + \frac{k Q q}{d}
\]

---

\subsection*{Άκρα ταλάντωσης}

\[
U(r) = E
\]

δηλαδή:

\[
mg r + \frac{k Q q}{r} = E
\]

που οδηγεί:

\[
r_{1,2} = \frac{E \pm \sqrt{E^2 - 4 (mg)(k Q q)}}{2mg}
\]

---

\subsection*{Μέγιστη ταχύτητα}

Στη θέση ισορροπίας:

\[
v_{\max} = \sqrt{\frac{2}{m}\left(E - U(r_{\text{eq}})\right)}
\]

---

\section*{Χειρισμός εφαρμογής}

\subsection*{Κουμπιά}

\begin{itemize}

\item \textbf{Ξεκίνα (Continuous)}  
Συνεχής ταλάντωση χωρίς διακοπή

\item \textbf{Μέχρι άκρο (Step)}  
Κίνηση μέχρι το επόμενο άκρο της ταλάντωσης

\item \textbf{Επανεκκίνηση}  
Επαναφορά στην αρχική κατάσταση

\end{itemize}

---

\subsection*{Δυνάμεις}

\begin{itemize}
\item Πράσινο: ηλεκτρική δύναμη
\item Πορτοκαλί: βάρος
\end{itemize}

---

\section*{Σενάρια}

\begin{itemize}

\item \textbf{Βασική ταλάντωση}  
Κανονική περιοδική κίνηση

\item \textbf{Ισορροπία}  
\[
d = r_{\text{eq}}
\]

\item \textbf{Μικρή ταλάντωση}  
\[
d \approx 1.05\, r_{\text{eq}}
\]

\item \textbf{Μεγάλη ταλάντωση}  
Μεγάλο εύρος και έντονη μη γραμμικότητα

\end{itemize}

---

\section*{Εμφανιζόμενα μεγέθη}

Στην οθόνη εμφανίζονται:

\begin{itemize}
\item \( d \): αρχική απόσταση
\item \( r_{\min}, \ r_{\max} \): άκρα ταλάντωσης
\item \( r_{\text{eq}} \): θέση ισορροπίας
\item \( v \): ταχύτητα
\item \( v_{\max} \): μέγιστη ταχύτητα
\end{itemize}

---

\section*{Διδακτικές επισημάνσεις}

\begin{itemize}
\item Η ταλάντωση δεν είναι απλή αρμονική
\item Η κίνηση είναι ασύμμετρη
\item Η ενέργεια διατηρείται:
\end{itemize}

\[
E = K + U = \text{σταθερό}
\]

---

\section*{Αριθμητική ολοκλήρωση}

Η προσομοίωση χρησιμοποιεί:

\[
v_{n+1} = v_n + \frac{F}{m}\Delta t
\]

\[
y_{n+1} = y_n - v_{n+1}\Delta t
\]

---

\section*{Σημείωση}

Η λειτουργία \textbf{Μέχρι άκρο} βασίζεται στον εντοπισμό του \textbf{σημείου καμπής} (turning point), δηλαδή στο σημείο όπου η ταχύτητα αλλάζει πρόσημο.

---

\end{document}
